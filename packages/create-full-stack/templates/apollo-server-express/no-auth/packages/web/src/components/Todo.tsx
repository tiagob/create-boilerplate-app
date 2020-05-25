import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";

import { Todo as TodoType } from "../graphql/__generated__";
import useDestroyTodo from "../graphql/useDestroyTodo";
import useUpdateTodo from "../graphql/useUpdateTodo";

const useStyles = makeStyles({
  complete: {
    textDecoration: "line-through",
  },
});

interface Props {
  todo: TodoType;
}

export default function Todo({ todo }: Props) {
  const classes = useStyles();
  const [updateTodo] = useUpdateTodo();
  const [destroyTodo] = useDestroyTodo();

  return (
    <ListItem
      key={todo.id}
      role={undefined}
      dense
      button
      onClick={() =>
        updateTodo({ variables: { id: todo.id, complete: !todo.complete } })
      }
    >
      <Checkbox checked={todo.complete} tabIndex={-1} disableRipple />
      <ListItemText
        primary={todo.name}
        classes={todo.complete ? { primary: classes.complete } : undefined}
      />
      <ListItemSecondaryAction>
        <IconButton
          aria-label="Delete"
          onClick={() => destroyTodo({ variables: { id: todo.id } })}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
