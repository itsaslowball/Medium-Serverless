import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import * as api from '../api-client'
import { SignInInput } from '@priyans34/medium-common'
import { useDispatch } from "react-redux";
import { login } from "../app/authSlice";
import { useNavigate} from "react-router-dom";


export const Signin = () => {
  const [formData, setFormData] = useState<SignInInput>({
    email: "",
    password: "",
  })
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: api.signin,
    onSuccess: (data) => {
      dispatch(login(data.jwt))
      navigate('/')
    },
  })

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(formData)
  }


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">SIGN IN</h2>
      <div className="min-w-[20rem] md:min-w-[40rem] p-6 rounded-lg border border-slate-600 bg-slate-500 shadow-lg">
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-white mb-1" htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full p-2 rounded border border-gray-300"
            />
          </div>
          <div>
            <label className="block text-white mb-1" htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full p-2 rounded border border-gray-300"
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 mt-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
      <div>
        <p className="text-black mt-4">Don't have an account? <a href="/signuo" className="text-blue-400">SignUp </a> </p>
      </div>
    </div>
  )
}
