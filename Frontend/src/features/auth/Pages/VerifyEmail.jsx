import { Link, useSearchParams } from "react-router-dom";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  const messages = {
    success: {
      title: "Email Verified Successfully!",
      description: "Your email has been verified. You can now log in."
    },
    "already-verified": {
      title: "Email Already Verified",
      description: "Your email is already verified. You can log in."
    },
    invalid: {
      title: "Verification Link Invalid or Expired",
      description: "Please request a new verification link."
    },
    error: {
      title: "Something Went Wrong",
      description: "We couldn't verify your email. Please try again later."
    }
  };

  const message = messages[status] || {
    title: "Verify Your Email",
    description: "Please open the verification link sent to your email."
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-100">
      <div className="w-full max-w-md rounded-2xl border border-[#31b8c6]/40 bg-zinc-900 p-8 text-center shadow-xl">
        <h1 className="text-2xl font-bold text-[#31b8c6]">
          {message.title}
        </h1>

        <p className="mt-3 text-sm text-zinc-300">
          {message.description}
        </p>

      {(status === "success" || status === "already-verified") && (
        <Link
          to="/login"
          className="mt-6 inline-block rounded-lg bg-[#31b8c6] px-5 py-3 font-semibold text-zinc-950 hover:bg-[#45c7d4]"
        >
          Go to Login
        </Link>
      )}
      </div>
    </section>
  );
};

export default VerifyEmail;