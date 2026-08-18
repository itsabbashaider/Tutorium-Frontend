const AuthLayout = ({ children }) => {
  return (
    <main className="min-h-screen bg-[#f9f9ff]">
      <div className="flex min-h-screen w-full items-center justify-center px-4 py-8 sm:px-6">
        <div className="flex w-full justify-center">
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;