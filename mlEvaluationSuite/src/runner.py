from pandas import DataFrame
from sklearn import metrics
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.metrics import mean_squared_error

import numpy as np
import pickle
import pandas as pd

from calculator import evaluate_performance_benefit
from data_plot import print_predicted_data, print_runtime_data
from ml_models import train_huber_model, train_linear_regression_model, train_random_forest_model, train_nn_model
from splitter import get_features, split_by_date, split_by_function, split_by_region
from converter import average_by_timestamp, convert_bool_columns, perform_one_hot_encoding
from reader import read_functions_data, replace_values_based_on_weektime, replace_values_except_weektime

NODE_TRAIN_COLUMNS = ['weektime','numberOfParallelExecutions','coldStart', 'maxMemoryUsed', 'fsRead','fsWrite','initDuration','involuntaryContextSwitches','majorPageFault','memoryLimitInMB','minorPageFault','systemCPUTime','unsharedDataSize','unsharedStackSize','userCPUTime','voluntaryContextSwitches','region_ap-northeast-1', 'region_eu-central-1', 'region_us-east-1']
# NODE_TRAIN_COLUMNS = ['weektime','coldStart', 'maxMemoryUsed', 'fsRead','fsWrite','initDuration','involuntaryContextSwitches','majorPageFault','memoryLimitInMB','minorPageFault','systemCPUTime','unsharedDataSize','userCPUTime','region_ap-northeast-1', 'region_eu-central-1', 'region_us-east-1']
STD_TRAIN_COLUMNS = ['weektime','memory-usage-percentage','maxMemoryUsed','memoryLimitInMB','coldStart','region_ap-northeast-1', 'region_eu-central-1', 'region_us-east-1', 'language_nodejs', 'language_java']

REGIONS = ['ap-northeast-1','eu-central-1','us-east-1']
one_hot_colums = ['language', 'sregion']

# Configurations

nodejs = True
scaled = True
poly = False
load_model = True
show_plot = False
evaluate_model = True

train_function = train_nn_model

model_name = f"models/all_{'nodejs' if nodejs else 'java'}_{'scaled' if scaled else 'unscaled'}_(150, 100, 50)_10000_relu.sav"


function_list = ['nodejs01','nodejs02','nodejs03','nodejs05'] if nodejs else ['java01','java02','java04']

# function_list = ['nodejs01','nodejs02','nodejs03','nodejs05','java01','java02','java04']



def test_model(X_test, y_test, ml_model):
    """
    Calculate the predictions and evaluation metrics for a given Multi-Layer Perceptron (MLP) model.

    Parameters:
        X_test (array-like): The input features for testing the model.
        y_test (array-like): The true labels for testing the model.
        mlp (MLPClassifier or MLPRegressor): The trained MLP model.

    Returns:
        tuple: A tuple containing the following elements:
            - y_pred (array-like): The predicted labels for the test data.
            - acc (float): The accuracy of the predictions.
            - mse (float): The mean squared error between the predicted and true labels.
            - mae (float): The mean absolute error between the predicted and true labels.
    """
    y_pred = ml_model.predict(X_test)

    acc = np.average(abs(y_test-y_pred)/y_test)
    mse = mean_squared_error(y_test, y_pred)
    mae = metrics.mean_absolute_error(y_test, y_pred)
    
    return y_pred, acc, mse, mae



def predict_future_performance():
    # Read Data
    ALL_DATA = read_functions_data(function_list)

    # Convert Data
    # ALL_DATA = average_by_timestamp(ALL_DATA)

    ALL_DATA = convert_bool_columns(perform_one_hot_encoding(ALL_DATA, one_hot_colums))

    # Optional Filter Data or manuel split
    # ALL_DATA = ALL_DATA[ALL_DATA['coldStart'] == False]

    TRAIN_DATA, TEST_DATA = split_by_date(ALL_DATA, 0.8)
 
    TEST_DATA = replace_values_based_on_weektime(TEST_DATA, TRAIN_DATA, nodejs)

    X_train, y_train = get_features(TRAIN_DATA, NODE_TRAIN_COLUMNS) if nodejs else get_features(TRAIN_DATA, STD_TRAIN_COLUMNS)
    X_test, y_test = get_features(TEST_DATA, NODE_TRAIN_COLUMNS) if nodejs else get_features(TEST_DATA, STD_TRAIN_COLUMNS)

    X_test_scaled = X_test

    # Optional Scale Data
    if scaled:
        scaler = StandardScaler()
        X_train = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)

    if poly:
        pfm = PolynomialFeatures(degree=4, include_bias=False)
        X_train = pfm.fit_transform(X_train)
        X_test_scaled = pfm.transform(X_test_scaled)


    # Train Model
    if load_model:
        ml_model = pickle.load(open(model_name, "br"))
    else:
        ml_model = train_function(X_train, y_train, model_name)

    # Test Model
    y_pred, acc, mse, mae = test_model(X_test_scaled, y_test, ml_model)

    if evaluate_model:
        rpb = evaluate_performance_benefit(TEST_DATA[['timestamp', 'region_ap-northeast-1', 'region_eu-central-1', 'region_us-east-1', 'coldStart', 'functionName', ' billedDuration', 'rounded_weektime']], y_pred)
    
        print(f"{rpb:.3f} & {acc:.3f} & {mse:.2f} & {mae:.2f} \\\\")

    if show_plot:
            print_predicted_data(y_pred, y_test)
            print_runtime_data(X_test, y_pred, y_test)


def predict_unknown_region(function_name):
    # Read Data
    ALL_DATA = read_functions_data(function_list)

    # Convert Data
    # ALL_DATA = average_by_timestamp(ALL_DATA)

    ALL_DATA = convert_bool_columns(perform_one_hot_encoding(ALL_DATA, one_hot_colums))

    # Optional Filter Data or manuel split
    # ALL_DATA = ALL_DATA[ALL_DATA['coldStart'] == False]

    TRAIN_DATA, TEST_DATA = split_by_function(ALL_DATA, function_name)

    X_train_gen, y_train_gen = get_features(TRAIN_DATA, NODE_TRAIN_COLUMNS) if nodejs else get_features(TRAIN_DATA, STD_TRAIN_COLUMNS)


    # Optional Scale Data
    if scaled:
        scaler = StandardScaler()
        # X_train = scaler.fit_transform(X_train)

    if load_model:
            ml_model = pickle.load(open(model_name, "br"))

    # Test Model
    df_list = []
    # MODEL_PATH = f"models/{function_name}_scaled_(150, 100, 50)_10000_a=relu.sav" if scaled else f"models/{function_name}_(150, 100, 50)_10000_a=relu.sav"

    
    for region in REGIONS:
        TRAIN_DATA_REGION, TEST_DATA_REGION = split_by_region(TEST_DATA, region)


        TRAIN_DATA_REGION, REPLACE_TEST_DATA = split_by_date(TRAIN_DATA_REGION)
        _, TEST_DATA_REGION = split_by_date(TEST_DATA_REGION)


        TEST_DATA_REGION = replace_values_except_weektime(TEST_DATA_REGION, REPLACE_TEST_DATA, nodejs)


        X_train, y_train = get_features(TRAIN_DATA_REGION, NODE_TRAIN_COLUMNS) if nodejs else get_features(TRAIN_DATA_REGION, STD_TRAIN_COLUMNS)
        X_test, y_test = get_features(TEST_DATA_REGION, NODE_TRAIN_COLUMNS) if nodejs else get_features(TEST_DATA_REGION, STD_TRAIN_COLUMNS)

        X_test_scaled = X_test

        if not load_model:
            df_train = []
            df_train.append(X_train)
            df_train.append(X_train_gen)
            X_train =  pd.concat(df_train, ignore_index=True)

            df_ytrain = []
            df_ytrain.append(y_train)
            df_ytrain.append(y_train_gen)
            y_train =  pd.concat(df_ytrain, ignore_index=True)

        if scaled:
            X_train = scaler.fit_transform(X_train)
            X_test_scaled = scaler.transform(X_test)

        
        if not load_model:
            ml_model = train_function(X_train, y_train, model_name)

        y_pred = ml_model.predict(X_test_scaled)

        cols = {'region':[region], 'functionName':[function_name]}
        df = DataFrame(data=cols)

        df['accuracy'] = np.average(abs(y_test-y_pred)/y_test)
        df['mse'] = mean_squared_error(y_test, y_pred)
        df['mae'] = metrics.mean_absolute_error(y_test, y_pred)

        if show_plot:
            print_predicted_data(y_pred, y_test)
            print_runtime_data(X_test, y_pred, y_test)

        df_list.append(df)

    res = pd.concat(df_list, ignore_index=True)
    return res



predict_future_performance()

# print(predict_unknown_region('nodejs02'))

# df_list = []
# for fun in function_list:
#     df_list.append(predict_unknown_region(fun))

# res = pd.concat(df_list, ignore_index=True)
# print(res)
# print(np.average(res['accuracy']))
# print(np.average(res['mse']))