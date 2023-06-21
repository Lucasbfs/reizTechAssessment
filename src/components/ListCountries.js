function ListCountries({ currentCountries }) {
  return (
    <>
      <ul className="flex flex-wrap justify-evenly gap-20">
        {currentCountries.map((country) => (
          <div
            key={country.name}
            className="group h-72 w-72 [perspective:1000px]"
          >
            <div className="relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              <div className="absolute inset-0">
                {country.flags && (
                  <img
                    src={country.flags.png}
                    alt={country.name}
                    className="max-h-full rounded-t-lg object-cover shadow-xl shadow-black/40 [transform:rotateY(180deg)]"
                  />
                )}
                <div className="absolute bottom-4 right-4 ">
                  <p className="[transform:rotateY(180deg)]">
                    Population: {country.population}
                  </p>
                </div>
              </div>

              <div className="absolute inset-0 h-full w-full rounded-xl bg-black/80 px-12 text-center text-slate-200 [transform-rotateY(180deg)] [backface-visibility:hidden]">
                <div className="flex min-h-full flex-col items-center justify-center">
                  <h1 className="text-3xl font-bold">{country.name}</h1>
                  <p className="text-lg">Region: {country.region}</p>
                  <p className="text-base">Area: {country.area}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </ul>
    </>
  );
}

export default ListCountries;
