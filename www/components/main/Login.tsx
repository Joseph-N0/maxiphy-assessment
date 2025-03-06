"use client"

import api from "@/lib/api"
import Image from "next/image"
import React, { useCallback, useState } from "react"
import { Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation"
import { AxiosError } from "axios"
import { toast } from "sonner"
import { Input } from "@/components/ui/input";



type LoginDataType = {
	email?: string
	password?: string
}

export default function Login() {
	const router = useRouter();

	const [showPassword, setShowPassword] = useState(false)
	const [loginData, setLoginData] = useState<LoginDataType>({
		email: undefined,
		password: undefined
	})

	const handleLogin = useCallback(async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await api.post('/auth/login', loginData);
			toast.success("Success", { description: "Login successful" });

			router.push("/dashboard")

		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				toast.error("Error", { description: error.response?.data?.message || "Login failed" });
			} else {
				toast.error("Error", { description: "An unexpected error occurred" });
			}
			
		}
	  }, [loginData, router]);

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
				<h1 className="text-2xl font-bold text-center mb-6">Login</h1>
				<form
					method="POST"
					className="space-y-4"
					onSubmit={handleLogin}>
					<div className="relative">
						<Input
							type="email"
							name="email"
							label="Email"
							icon={<Mail className="size-4 text-gray-500" />} 
							placeholder="Enter Email address"
							value={loginData.email ?? ""}
							onChange={(e) => setLoginData({ ...loginData, email: e.currentTarget.value })}
							required
						/>
					</div>
					<div className="relative">
						<Input
							type={showPassword ? "text" : "password"}
							name="password"
							label="Password"
							icon={<Lock className="size-4 text-gray-500" />}
							placeholder="Enter Password"
							value={loginData.password ?? ""}
							onChange={(e) => setLoginData({ ...loginData, password: e.currentTarget.value })}
							required
						/>
						<span
							className="absolute right-4 top-2/3 transform -translate-y-1/2 cursor-pointer text-gray-500"
							onClick={() => setShowPassword(!showPassword)}>
							{showPassword ? (
								<svg
								fill="#000000"
								height="20px"
								width="20px"
								version="1.1"
								viewBox="0 0 512 512"
								enableBackground="new 0 0 512 512">
								<g>
									<path d="m494.8,241.4l-50.6-49.4c-50.1-48.9-116.9-75.8-188.2-75.8s-138.1,26.9-188.2,75.8l-50.6,49.4c-11.3,12.3-4.3,25.4 0,29.2l50.6,49.4c50.1,48.9 116.9,75.8 188.2,75.8s138.1-26.9 188.2-75.8l50.6-49.4c4-3.8 11.7-16.4 0-29.2zm-238.8,84.4c-38.5,0-69.8-31.3-69.8-69.8 0-38.5 31.3-69.8 69.8-69.8 38.5,0 69.8,31.3 69.8,69.8 0,38.5-31.3,69.8-69.8,69.8zm-195.3-69.8l35.7-34.8c27-26.4 59.8-45.2 95.7-55.4-28.2,20.1-46.6,53-46.6,90.1 0,37.1 18.4,70.1 46.6,90.1-35.9-10.2-68.7-29-95.7-55.3l-35.7-34.7zm355,34.8c-27,26.3-59.8,45.1-95.7,55.3 28.2-20.1 46.6-53 46.6-90.1 0-37.2-18.4-70.1-46.6-90.1 35.9,10.2 68.7,29 95.7,55.4l35.6,34.8-35.6,34.7z" />
								</g>
							</svg>
							) : (
								<svg
									height="20px"
									width="20px"
									viewBox="0 0 24 24"
									fill="none">
									<path
										d="M4 4L20 20"
										stroke="#000000"
										strokeWidth="2"
										strokeLinecap="round"
									/>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M6.22308 5.63732C4.19212 6.89322 2.60069 8.79137 1.73175 11.0474C1.49567 11.6604 1.49567 12.3396 1.73175 12.9526C3.31889 17.0733 7.31641 20 12 20C14.422 20 16.6606 19.2173 18.4773 17.8915L17.042 16.4562C15.6033 17.4309 13.8678 18 12 18C8.17084 18 4.89784 15.6083 3.5981 12.2337C3.54022 12.0835 3.54022 11.9165 3.5981 11.7663C4.36731 9.76914 5.82766 8.11625 7.6854 7.09964L6.22308 5.63732ZM9.47955 8.89379C8.5768 9.6272 7.99997 10.7462 7.99997 12C7.99997 14.2091 9.79083 16 12 16C13.2537 16 14.3728 15.4232 15.1062 14.5204L13.6766 13.0908C13.3197 13.6382 12.7021 14 12 14C10.8954 14 9.99997 13.1046 9.99997 12C9.99997 11.2979 10.3618 10.6802 10.9091 10.3234L9.47955 8.89379ZM15.9627 12.5485L11.4515 8.03729C11.6308 8.0127 11.8139 8 12 8C14.2091 8 16 9.79086 16 12C16 12.1861 15.9873 12.3692 15.9627 12.5485ZM18.5678 15.1536C19.3538 14.3151 19.9812 13.3259 20.4018 12.2337C20.4597 12.0835 20.4597 11.9165 20.4018 11.7663C19.1021 8.39172 15.8291 6 12 6C11.2082 6 10.4402 6.10226 9.70851 6.29433L8.11855 4.70437C9.32541 4.24913 10.6335 4 12 4C16.6835 4 20.681 6.92668 22.2682 11.0474C22.5043 11.6604 22.5043 12.3396 22.2682 12.9526C21.7464 14.3074 20.964 15.5331 19.9824 16.5682L18.5678 15.1536Z"
										fill="#000000"
									/>
								</svg>	
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
							Login
						</button>
					</div>
				</form>
				<div className="text-center mt-4">
					<p className="text-[12px] font-[900]">
						You don’t have an account?{" "}
						<a
							href="/register"
							className="text-[12px] text-[var(--blue)] underline underline-offset-1 font-[900]">
							REGISTER
						</a>
					</p>
				</div>
			</div>
		</div>
	)
}
