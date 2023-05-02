import { Button, IconAngleDown, IconAngleUp, IconGlobe, Link } from "hds-react";
import styles from './navigation.module.scss';

interface LanguageSelect {
    langLinks: any,
    activePath: any,
    setOpen: any,
    open: any,
}

function LanguageSelect({
  langLinks,
  activePath,
  setOpen,
  open,
}: LanguageSelect) {
  return (
    <div>
      <nav className={styles.LanguageSelector}>
        <div className={styles.languageSelect}>
          <Link aria-current={langLinks.fi === activePath} href={langLinks.fi}>
            Suomi
          </Link>
          <Link aria-current={langLinks.sv === activePath} href={langLinks.sv}>
            Svenska
          </Link>
          <Link aria-current={langLinks.en === activePath} href={langLinks.en}>
            English
          </Link>
        </div>
        <Button
          className={styles.buttonGlobe}
          onClick={() => setOpen(!open)}
          onBlur= {() => setOpen(false)}
          iconRight={
            !open ? <IconAngleDown size="s" /> : <IconAngleUp size="s" />
          }
        >
          <IconGlobe size="s" />
        </Button>
        {open && (
          <ul className={styles.globalDropDown }>
            <li>
              <a href="">Apple</a>
            </li>
            <li>
              <a href="">Banana</a>
            </li>
            <li>
              <a href="">Pear</a>
            </li>
            <li>
              <a href="">Cherry</a>
            </li>
            <li>
              <a href="">Grape</a>
            </li>
            <li>
              <a href="">Lemon</a>
            </li>
          </ul>
        )}
      </nav>
    </div>
  );
}

export default LanguageSelect;
