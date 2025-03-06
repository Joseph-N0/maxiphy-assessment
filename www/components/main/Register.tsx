"use client"

import React, { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { AxiosError } from "axios"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"


type RegisterDataType = {
	name?: string
	email?: string
	password?: string
	confirmPassword?: string
}

export default function Register() {
	const router = useRouter();

	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [honeypot, setHoneypot] = useState<string | undefined>(undefined);
	const [registerData, setRegisterData] = useState<RegisterDataType>({
			name: undefined,
			email: undefined,
			password: undefined,
			confirmPassword: undefined
		})

		const handleRegister = useCallback(async (e: React.FormEvent) => {
			e.preventDefault();

			if (honeypot) return;
			if(registerData.password !== registerData.confirmPassword) {
				toast.error("Error", { description: "Passwords do not match" });
				return;
			}

			try {
				await api.post('/user/register', {...registerData, honeypot});
				toast.success("Success", { description: "Account created successfully" });

				router.push("/dashboard")
			}catch(error: unknown) {
				if (error instanceof AxiosError) {
					toast.error("Error", { description: error.response?.data?.message || "An unexpected error occurred" });
				} else {
					toast.error("Error", { description: "An unexpected error occurred" });
				}
			}
		}, [registerData, router, honeypot]);

	return (
		<div className="login-page min-h-screen flex items-center justify-center relative">
			<Image
				className="absolute inset-0 w-full h-full object-cover"
				src="/images/todo.avif"
				alt="Login background"
				width={1920}
				height={1080}
				priority
			/>
			<div className="bg-white rounded-lg shadow-lg p-8 max-w-md z-10 w-[83%]">
				<h1 className="text-2xl font-bold text-center mb-6">Register</h1>
				<form
					method="POST"
					className="space-y-4"
					onSubmit={handleRegister}>
					 <Input
						type="text"
						name="honeypot"
						style={{ display: "none" }}
						autoComplete="off"
						tabIndex={-1}
						onChange={(e) => setHoneypot(e.currentTarget.value)}
					/>
					<Input
						type="text"
						name="name"
						className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
						placeholder="Full Name"
						id="name"
						required
						onChange={(e) => setRegisterData({ ...registerData, name: e.currentTarget.value })}
					/>
					<Input
						type="email"
						name="email"
						className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
						placeholder="Email address"
						id="email"
						required
						onChange={(e) => setRegisterData({ ...registerData, email: e.currentTarget.value })}
					/>

					<div className="relative">
						<Input
							type={showPassword ? "text" : "password"}
							name="password"
							id="password"
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
							placeholder="Enter New Password"
							required
							onChange={(e) => setRegisterData({ ...registerData, password: e.currentTarget.value })}
						/>

						<span
							className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
							onClick={() => setShowPassword(!showPassword)}>
							{showPassword ? (
								<Eye size={20} color="#000000" />
								
							) : (
								<EyeOff size={20} color="#000000" />
							)}
						</span>
					</div>
					<div className="relative">
						<Input
							type={showConfirmPassword ? "text" : "password"}
							id="confirm-password"
							name="confirm-password"
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
							placeholder="Confirm Password"
							required
							onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.currentTarget.value })}
						/>
						<span
							className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
							{showConfirmPassword ? (
								<Eye size={20} color="#000000" />
								
							) : (
								<EyeOff size={20} color="#000000" />
							)}
						</span>
					</div>

					<div className="flex justify-center items-center">
						<button
							className="btn-primary text-[13px]"
							style={{
								padding: "0.75rem 3rem"
							}}
							type="submit">
							Register
						</button>
					</div>
				</form>
				<div className="text-center mt-4">
					<p className="text-[12px] font-[900]">
						Already have an account?{" "}
						<a
							href="/login"
							className="text-[12px] text-[var(--blue)] underline underline-offset-1 font-[900]">
							LOGIN
						</a>
					</p>
				</div>
			</div>
		</div>
	)
}
