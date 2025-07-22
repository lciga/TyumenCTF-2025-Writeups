import { Link } from "react-router";

const heading = new URL("../../assets/heading-bg.png", import.meta.url);

export function Header() {
  return (
    <div className="relative">
      <Link to="/">
        <img src={heading.toString()} />
      </Link>

      <div className="absolute flex justify-around w-full top-[100px] text-[16px]">
        <a href="#" className="hover:text-white">
          WEB - образование
        </a>
        <a href="#" className="hover:text-white">
          Виртуальный музей
        </a>
        <a href="#" className="hover:text-white">
          Дистанционное обучение
        </a>
        <a href="#" className="hover:text-white">
          Контакты
        </a>
        <a href="#" className="hover:text-white">
          Приёмная директора
        </a>
        <a href="#" className="hover:text-white">
          Объявления
        </a>
      </div>
    </div>
  );
}
