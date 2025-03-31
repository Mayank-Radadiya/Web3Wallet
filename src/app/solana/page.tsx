import SeedInput from "@/components/global/SeedInput";


const Page = () => {
  return (
    <main className="min-h-screen text-black dark:text-[#f7f7f7] p-5">
      <div className="flex flex-col px-10 pt-14 justify-start w-full">
        <h1 className="text-5xl font-bold">Secret Recovery Phrase</h1>
        <p className="text-2xl mt-4 font-semibold">
          Save these words in a safe place.
        </p>
        <div className="w-full  mt-10">
          <SeedInput />
        </div>
      </div>
    </main>
  );
};

export default Page;
