import pickle
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import HuberRegressor, LinearRegression
from sklearn.neural_network import MLPRegressor


def train_linear_regression_model(X_train, y_train, model_name=None):
    return LinearRegression().fit(X_train, y_train)

def train_random_forest_model(X_train, y_train, model_name=None):
    return RandomForestRegressor(max_depth=10, random_state=10).fit(X_train, y_train)

def train_huber_model(X_train, y_train, model_name=None):
    return HuberRegressor().fit(X_train, y_train)

def train_nn_model(X_train, y_train, model_name=None):
    """
    Trains a model using the provided training data.

    Parameters:
        X_train (array-like): The input features for training the model.
        y_train (array-like): The target values for training the model.
        model_name (str, optional): The name of the model to be saved. Defaults to None.

    Returns:
        MLPRegressor: The trained MLPRegressor model.

    """

    hls = (150, 100, 50)
    maxIter = 10000
    activation = 'relu'

    mlp = MLPRegressor(hidden_layer_sizes=hls, max_iter=maxIter, random_state=42, activation=activation, solver='adam', alpha=0.05, learning_rate='constant')

    mlp.fit(X_train, y_train)
    if model_name is not None:
        path = f"models/{model_name}_{hls}_{maxIter}_{activation}.sav"
        try:
            pickle.dump(mlp, open(path, "bx"))
            print(f"Saved Model {model_name} to {path}")
        except:
            print('Model already exists')

    return mlp