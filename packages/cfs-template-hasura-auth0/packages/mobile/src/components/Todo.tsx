import { Todos as TodoType, useDeleteTodo, useUpdateTodo } from "common";
import React from "react";
import { StyleSheet } from "react-native";
import { Button, CheckBox, Icon, ListItem } from "react-native-elements";

const styles = StyleSheet.create({
  lineThrough: {
    textDecorationLine: "line-through",
  },
});

interface Props {
  todo: TodoType;
}

export default function Todo({ todo }: Props) {
  const [updateTodo] = useUpdateTodo();
  const [deleteTodo] = useDeleteTodo();
  const onPress = () =>
    updateTodo({
      variables: { id: todo.id, complete: !todo.complete },
    });

  return (
    <ListItem
      onPress={onPress}
      leftElement={<CheckBox onPress={onPress} checked={todo.complete} />}
      title={todo.name}
      titleStyle={todo.complete ? styles.lineThrough : undefined}
      rightElement={
        <Button
          icon={
            <Icon
              name="delete"
              onPress={() => deleteTodo({ variables: { id: todo.id } })}
            />
          }
          type="outline"
          raised
        />
      }
    />
  );
}
