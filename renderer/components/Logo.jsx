function Logo({ logoSize = "text-4xl", imgSize = 50 }) {
  const borderRadius = imgSize / 2; // Adjust the divisor to change the border radius proportionally

  return (
    <div
      className="flex w-max items-center gap-2 border p-4 bg-white"
      style={{ borderRadius: `${borderRadius}px` }}
    >
      <img
        src="/logo.png" // Ensure the image is placed in the 'public' directory
        alt="HealthMate Logo"
        width={imgSize}  // Adjust width and height as per the actual size you want
        height={imgSize}
        className="rounded-lg"
      />
      <h1 className={`${logoSize} font-bold text-[--first]`}>
        Health<span className={`${logoSize} font-bold mb-4 text-[--second]`}>Mate</span>
      </h1>
    </div>
  );
};

export default Logo;
