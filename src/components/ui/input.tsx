import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				className={cn(
					"h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 font-medium text-slate-800 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 disabled:opacity-50",
					className
				)}
				ref={ref}
				type={type}
				{...props}
			/>
		);
	}
);
Input.displayName = "Input";

export { Input };
