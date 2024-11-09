function Logo(){
  return (
    <div className="flex w-max items-center gap-2 border rounded-3xl p-4 bg-white">
      <img
        src="/logo.png" // Ensure the image is placed in the 'public' directory
        alt="HealthMate Logo"
        width={60}  // Adjust width and height as per the actual size you want
        height={20}
        className="rounded-lg"
      />
        <h1 className="text-4xl font-bold text-[--first] ">Health<span className="text-4xl font-bold mb-4 text-[--second]">Mate</span></h1>
    </div>
  );
};

export default Logo;
