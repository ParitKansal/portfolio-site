import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User } from "@shared/schema";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
    const [hashed, salt] = stored.split(".");
    const hashedPasswordBuf = Buffer.from(hashed, "hex");
    const suppliedPasswordBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
}

export function setupAuth(app: Express) {
    const sessionSettings: session.SessionOptions = {
        secret: process.env.SESSION_SECRET || "super_secret_session_key",
        resave: false,
        saveUninitialized: false,
        store: storage.sessionStore,
        cookie: {
            secure: process.env.NODE_ENV === "production" && process.env.USE_SECURE_COOKIES === "true",
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }
    };

    if (app.get("env") === "production") {
        app.set("trust proxy", 1);
    }

    app.use(session(sessionSettings));
    app.use(passport.initialize());
    app.use(passport.session());

    // Google Strategy
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID || "missing_client_id",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "missing_client_secret",
        callbackURL: "/api/auth/google/callback"
    }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
        try {
            const googleId = profile.id;
            const email = profile.emails?.[0]?.value;
            const username = email || profile.displayName;

            // Email whitelist check
            if (process.env.ADMIN_EMAIL && email !== process.env.ADMIN_EMAIL) {
                return done(null, false, { message: "Unauthorized email." });
            }

            // Find existing user by Google ID
            let user = await storage.getUserByGoogleId(googleId);

            if (!user) {
                user = await storage.createUser({
                    username,
                    googleId,
                    password: null
                });
            }
            return done(null, user);
        } catch (err) {
            return done(err as Error);
        }
    }));

    passport.serializeUser((user, done) => done(null, (user as User).id));
    passport.deserializeUser(async (id: number, done) => {
        const user = await storage.getUser(id);
        done(null, user);
    });

    // Auth Routes
    app.get("/api/auth/google", passport.authenticate("google", {
        scope: ["profile", "email"]
    }));

    app.get("/api/auth/google/callback",
        passport.authenticate("google", { failureRedirect: "/" }),
        (req, res) => {
            res.redirect("/admin");
        }
    );

    app.post("/api/logout", (req, res, next) => {
        req.logout((err) => {
            if (err) return next(err);
            res.sendStatus(200);
        });
    });

    app.get("/api/user", (req, res) => {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        res.json(req.user);
    });
}

// Helper to hash password for seeding
export { hashPassword };
