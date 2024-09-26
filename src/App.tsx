import { useEffect, useRef, useState } from "react"
import Filter from "./components/filter"
import Header from "./components/header"
import Hero from "./components/hero"
import SearchBar from "./components/searchbar"
import fetchCars from "./utils/fetchCars"
import { CarType } from "./types"
import Warning from "./components/warning"
import Card from "./components/card"
import Loadmore from "./components/loadmore"
import { useSearchParams } from "react-router-dom"
import Year from "./components/filter/year"

const App = () => {
  const [params, setParams] = useSearchParams();

  const [cars,setCars] = useState<CarType[] | null>(null);
  const [isError,setIsError] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(5);

  useEffect(() => {
    //* URL'deki bütün paramları bir nesne haline getir
    const paramsObj = Object.fromEntries(params.entries());

    fetchCars({ limit, ...paramsObj })
    .then((data) => setCars(data))
    .catch((err) => setIsError(true));
  }, [limit, params]);

const catalogueRef = useRef<HTMLDivElement>(null);

  return (
   <div className="min-h-screen text-white bg-[rgb(23,23,23)]">
    <Header />

    <Hero catalogueRef={catalogueRef}/>

  <div ref={catalogueRef} className="mt-12 padding-x padding-y max-width">
    <div className="home__text-container">
      <h1 className="text-4xl font-extrabold">Araba Kataloğu</h1>
      <p>Beğenebileceğin arabaları keşfet</p>
    </div>
    <div className="home__filters">
      <SearchBar />

      <div className="home__filter-container">
        <Filter />
        <Year />
      </div>
    </div>

    {/*
     * Araçları Listeleme
     1- Cars null ise > Henüz API'dan cevap gelmemiştir
     2- isError true ise > API'den hata gelmemiştir.
     3- Cars boş dizi ise > Aranılan kriterlere uygun veri yok
     4- Cars dolu  bir ise > API'den araçlar gelmiştir
    */}

    {
      !cars ? (
        <Warning>YÜkleniyor...</Warning>
      ) : isError ? (
        <Warning>Üzgünüz bir sorun oluştu</Warning>
      ) : cars.length < 1 ? (
        <Warning>Aranılan kriterlere uygun araç bulunamadı</Warning>
      ) : (
        cars.length > 1 &&
         <section>
<div className="home__cars-wrapper">
  {cars.map((car,i) => (
  <Card car={car} key={i}/>
))}
</div>

<Loadmore 
limit={limit}
handleClick={() => {
  setLimit(limit + 5);
}}/>
        </section>
      )}
  </div>
   </div>
  );
};

export default App;