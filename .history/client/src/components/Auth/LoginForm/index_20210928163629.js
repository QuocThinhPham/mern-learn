import Alert from 'components/Alert';
import { AuthContext } from 'contexts/AuthContext';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

const LoginForm = () => {
    const { login } = useContext(AuthContext);
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const [alert, setAlert] = useState(null);

    const handleChange = (event) =>
        setForm({ ...form, [event.target.name]: event.target.value });

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const { success, message } = await login(form);
            if (!success) {
                setAlert({ type: 'bg-red-600', message });
                setTimeout(() => setAlert(null), 3000);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <form onSubmit={handleLogin}>
                <Alert info={alert} />
                <div className="mb-3">
                    <input
                        value={form.username}
                        onChange={handleChange}
                        type="email"
                        placeholder="Email"
                        name="email"
                        required
                        className="w-4/5 h-full rounded-sm border-0 font-main text-[10px] sm:text-sm px-5"
                    />
                </div>
                <div className="mb-3">
                    <input
                        value={form.password}
                        onChange={handleChange}
                        type="password"
                        placeholder="Password"
                        name="password"
                        required
                        className="w-4/5 h-full rounded-sm border-0 font-main text-[10px] sm:text-sm px-5"
                    />
                </div>
                <button
                    type="submit"
                    className="block mx-auto py-1 sm:py-3 px-5 w-4/5 rounded-lg bg-green-400 font-main text-sm sm:text-lg text-white"
                >
                    Login
                </button>
            </form>
            <p className="font-main text-[10px] sm:text-sm text-white mt-5 tracking-wide">
                Don't have an account?
                <Link to="register">
                    <button className="px-5 py-1 ml-5 rounded-lg bg-blue-500 font-main text-xs sm:text-base text-white">
                        Register
                    </button>
                </Link>
            </p>
        </>
    );
};

export default LoginForm;
