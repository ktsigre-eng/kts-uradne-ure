import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`bg-kts-gray border border-neutral-800 rounded-3xl p-6 shadow-xl transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...props }: CardProps) {
  return <div className={`mb-4 flex flex-col space-y-1.5 ${className}`} {...props}>{children}</div>;
}

export function CardTitle({ children, className = "", ...props }: CardProps) {
  return <h3 className={`text-xl font-bold leading-none tracking-tight text-white ${className}`} {...props}>{children}</h3>;
}

export function CardContent({ children, className = "", ...props }: CardProps) {
  return <div className={`pt-0 ${className}`} {...props}>{children}</div>;
}

export function CardFooter({ children, className = "", ...props }: CardProps) {
  return <div className={`flex items-center pt-4 ${className}`} {...props}>{children}</div>;
}
