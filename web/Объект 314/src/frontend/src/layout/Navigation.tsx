import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/user";
import { Link } from "react-router";

const background = new URL("../../assets/navigation-bg.jpg", import.meta.url);

const stars = [
  new URL(`../../assets/stars/stars_1.jpg`, import.meta.url),
  new URL(`../../assets/stars/stars_2.jpg`, import.meta.url),
  new URL(`../../assets/stars/stars_3.jpg`, import.meta.url),
  new URL(`../../assets/stars/stars_4.png`, import.meta.url),
  new URL(`../../assets/stars/stars_5.jpg`, import.meta.url),
];

export function Navigation() {
  const { user } = useContext(UserContext);
  const [starBackgroundUrl, setStarBackgroundUrl] = useState<
    undefined | string
  >();

  useEffect(() => {
    let currentStar = 0;

    const updateStar = () => {
      currentStar = (currentStar + 1) % stars.length;
      setStarBackgroundUrl(`url(${stars[currentStar].toString()})`);
    };

    const interval = setInterval(updateStar, 5000);
    updateStar();

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
      }}
    >
      <div className="text-white text-center font-bold text-[14px] h-[40px]">
        НАШИ ЗВЁЗДЫ
      </div>

      <div className="flex justify-center mt-[5px]">
        <div
          className="w-[150px] h-[200px]"
          style={{
            backgroundImage: starBackgroundUrl,
            backgroundSize: "cover",
          }}
        ></div>
      </div>

      <div className="mt-[30px] ml-[20px] mr-[20px] pb-2">
        <div className="font-bold text-center">
          Сведения об образовательной организации
        </div>

        <a className="block hover:text-white" href="#">
          Главная (Основные сведения)
        </a>
        <a className="block hover:text-white" href="#">
          Структура и органы управления образовательной организацией
        </a>
        <a className="block hover:text-white" href="#">
          Документы
        </a>
        <a className="block hover:text-white" href="#">
          Образование
        </a>
        <a className="block hover:text-white" href="#">
          Образовательные стандарты
        </a>
        <a className="block hover:text-white" href="#">
          Руководство. Педагогический состав
        </a>
        <a className="block hover:text-white" href="#">
          Материально-техническое обеспечение и оснащенность образовательного
          процесса
        </a>
        <a className="block hover:text-white" href="#">
          Стипендии и иные виды материальной поддержки
        </a>
        <a className="block hover:text-white" href="#">
          Вакантные места для приема (перевода)
        </a>
        {user?.isAdmin && (
          <Link
            to="/classified/secure-connection-vt100"
            className="block hover:text-white"
          >
            Установить защищенное подключение
          </Link>
        )}
        <a className="block hover:text-white" href="#">
          Платные образовательные услуги
        </a>
        <a className="block hover:text-white" href="#">
          Финансово-хозяйственная деятельность
        </a>
      </div>
    </div>
  );
}
