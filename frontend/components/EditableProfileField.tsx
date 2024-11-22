import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, Text, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useUser } from '../app/screens/UserContext';

interface EditableProfileFieldProps {
  header: string;
  text: string;
  editable: boolean;
  email: string;
}

const EditableProfileField = (props: EditableProfileFieldProps) => {
  const { userEmail } = useUser();

  const [field, setField] = useState(props.text);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setField(props.text);
  }, [props.text]);

  const handleEditing = async () => {
    if (editing) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/update_profile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },  
          body: JSON.stringify({
            field: props.header.toLowerCase(),
            value: field,
            email: userEmail
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update profile');
        }

      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
    setEditing(!editing);
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {props.editable && (
          <Button
            icon="pencil"
            mode="contained"
            onPress={handleEditing}
          >
            {editing ? 'Save' : 'Edit'}
          </Button>
        )}
        <Text style={styles.header}>{props.header}: {field}</Text>
      </View>
      {editing && props.editable && (
        <TextInput
          label="Edit Text"
          value={field}
          onChangeText={text => setField(text)}
          style={styles.input}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    marginLeft: 16,
  },
  container: {
    flex: 1,
    display: 'flex',
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    marginTop: 16,
  },
});

export default EditableProfileField