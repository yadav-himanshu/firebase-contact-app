import { motion } from "framer-motion";

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-8 rounded-xl border bg-card p-8 shadow-sm"
            >
                <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-card-foreground">{title}</h2>
                    {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
                </div>
                {children}
            </motion.div>
        </div>
    );
};

export default AuthLayout;
