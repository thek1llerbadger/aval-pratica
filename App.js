import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [view, setView] = useState('lista');
  const [recipes, setRecipes] = useState([]);
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [preparation, setPreparation] = useState('');
  const [editingRecipeId, setEditingRecipeId] = useState(null);

  // Função para carregar receitas do localStorage
  useEffect(() => {
    const loadRecipes = () => {
      try {
        const storedRecipes = localStorage.getItem('recipes');
        if (storedRecipes) {
          setRecipes(JSON.parse(storedRecipes));
        }
      } catch (e) {
        console.error('Falha ao carregar receitas.', e);
      }
    };
    loadRecipes();
  }, []);

  // Função para salvar receitas no localStorage
  const saveRecipes = (newRecipes) => {
    try {
      localStorage.setItem('recipes', JSON.stringify(newRecipes));
    } catch (e) {
      console.error('Falha ao salvar receitas.', e);
    }
  };

  const handleAddRecipe = () => {
    if (!title || !ingredients || !preparation) {
      return;
    }

    const newRecipe = {
      id: Date.now().toString(),
      title: title,
      ingredients: ingredients,
      preparation: preparation,
    };

    const updatedRecipes = editingRecipeId
    ? recipes.map((recipe) =>
        recipe.id === editingRecipeId ? newRecipe : recipe
      )
    : [...recipes, newRecipe];
//teste
  setRecipes(updatedRecipes);
  saveRecipes(updatedRecipes);
  setTitle('');
  setIngredients('');
  setPreparation('');
  setEditingRecipeId(null); // Limpa o estado de edição
  setView('lista');
};

const handleDeleteRecipe = (id) => {
    const userConfirmed = window.confirm('Deseja deletar essa receita?');

    if (userConfirmed) {
      const updatedRecipes = recipes.filter((recipe) => recipe.id !== id);
      setRecipes(updatedRecipes);
      saveRecipes(updatedRecipes);
    }
};

  const handleChangeRecipe = (id) => {
    const recipeToEdit = recipes.find((recipe) => recipe.id === id);
    if (recipeToEdit) {
      setTitle(recipeToEdit.title);
      setIngredients(recipeToEdit.ingredients);
      setPreparation(recipeToEdit.preparation);
      setEditingRecipeId(id); // Armazena o ID da receita sendo editada
      setView('formulario');
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      {currentScreen === 'home' ? (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={styles.header}>Bem-vindo ao Meu Livro de Receitas</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setCurrentScreen('app')}
          >
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.header}>Meu Livro de Receitas</Text>
          {view === 'lista' ? (
            <View>
              <TouchableOpacity style={styles.addButton} onPress={() => setView('formulario')}>
                <Text style={styles.buttonText}>Adicionar Nova Receita</Text>
              </TouchableOpacity>
              {recipes.length === 0 ? (
                <Text style={styles.emptyText}>Nenhuma receita cadastrada.</Text>
              ) : (
                recipes.map((item) => (
                  <View key={item.id} style={styles.recipeItem}>
                    <View style={styles.recipeTextContainer}>
                      <Text style={styles.recipeTitle}>{item.title}</Text>
                      <Text style={styles.recipeIntTitle}>Ingredientes</Text>
                      <Text style={styles.recipeIngredients}>{item.ingredients}</Text>
                      <Text style={styles.recipeIntTitle}>Modo de preparo</Text>
                      <Text style={styles.recipeIngredients}>{item.preparation}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          ) : (
            <View style={styles.formContainer}>
              <Text style={styles.formHeader}>Adicionar Receita</Text>
              <TextInput
                style={styles.input}
                placeholder="Título da Receita"
                value={title}
                onChangeText={setTitle}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Ingredientes"
                value={ingredients}
                onChangeText={setIngredients}
                multiline={true}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Modo de preparo"
                value={preparation}
                onChangeText={setPreparation}
                multiline={true}
              />
              <View style={styles.formActions}>
                <TouchableOpacity
                  style={[styles.formButton, styles.cancelButton]}
                  onPress={() => setView('lista')}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.formButton, styles.saveButton]}
                  onPress={handleAddRecipe}
                >
                  <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#264ea3',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  formHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderColor: '#bdc3c7',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  formButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  saveButton: {
    backgroundColor: '#27ae60',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  recipeItem: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeTextContainer: {
    flex: 1,
    marginRight: 15,
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  recipeIngredients: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  recipeIntTitle: {
    fontSize: 16,
    fontWeight: 'semi-bold',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  changeButton: {
    backgroundColor: '#2a7ee2',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 18,
    color: '#95a5a6',
  },
});