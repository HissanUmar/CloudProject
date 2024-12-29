import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'


const AuthPages = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && !formData.name) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    }


  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, password: formData.password })
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
        localStorage.setItem("token", json.authtoken);
        global.isUser=true;
        global.isVendor=false;
    }
    else {
        alert("You entered Invalid Credentials")
    }
    }


    const handleSubmit2 = async(e) => {
        e.preventDefault();
        const response = await fetch(" http://localhost:8080/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: formData.name ,email: formData.email, password: formData.password })
        });
        const json = await response.json();
        console.log(json);
        if (json.success) {
            localStorage.setItem("token", json.authtoken);
            global.isUser=false;
            global.isVendor=true;
        }
        else {
            alert(json.error)
        }
    }

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-light p-4">
      <div className="card w-100 max-w-md p-4 border">
        <h3 className="card-title text-center mb-4">{isLogin ? 'Login' : 'Sign Up'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-control"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
              />
              {errors.name && <small className="text-danger">{errors.name}</small>}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <small className="text-danger">{errors.email}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && <small className="text-danger">{errors.password}</small>}
          </div>

          <button type="submit" className="btn btn-primary w-100">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center mt-3">
          <small>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={() => {
                navigate('/sign-up');
                setIsLogin(!isLogin);
                setFormData({ name: '', email: '', password: '' });
                setErrors({});
              }}
            >
              {isLogin ? 'Sign up' : 'Login'}
            </button>
          </small>
        </div>
      </div>
    </div>
  );
};

export default AuthPages;
