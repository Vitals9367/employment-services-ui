import { Button, IconPrinter } from "hds-react"
import styles from './PrintButton.module.scss'
interface buttonProps {
  onClick: any
  buttonText: string
}

export default function PrintButton({onClick, buttonText}: buttonProps): JSX.Element {
  
  return (
    <Button 
      onClick={onClick}
      className={styles.printButton}
      size="small"
      variant="supplementary"
      iconLeft={<IconPrinter />}
      >
        {buttonText}
    </Button>)
}
