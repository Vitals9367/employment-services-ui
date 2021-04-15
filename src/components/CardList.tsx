import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import SingleCard from "./SingleCard";
import ListItem from "./ListItem";
import Typography from "@material-ui/core/Typography";
import { Lang } from "../types";

const useStyles = makeStyles((theme) => ({
  title: {
    nocolor: "white",
    nobackground: "blue",
    fontFamily: "HelsinkiGrotesk",
    fontSize: 36,
    paddingBottom: 25,
    paddingTop: 15,
    fontWeight: "bold",
  },
}));

interface CardListProps {
  title?: string;
  cards: any;
  lang: Lang;
  type?: string;
}

function CardList(props: CardListProps) {
  const classes = useStyles(props);
  const { title, cards, lang, type } = props;

  return (
    <>
      <Grid container style={{ zIndex: 10 }}>
        {title && (
          <Typography gutterBottom variant="h5" component="h2" className={classes.title}>
            {title}
          </Typography>
        )}
        <Grid container direction={"row"} spacing={3} className={""}>
          {cards.map((item: any, i: number) => (
            <Grid item xs={12} md={4} key={i}>
              { type === 'listItem' ? (
                <ListItem key={i} {...item} className={classes.title} lang={lang} />
              ) : (
                <SingleCard key={i} {...item} className={classes.title} lang={lang} />
              )}
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
}

export default CardList;
