import matplotlib.pyplot as plt
import seaborn as sns

import numpy as np

from datetime import datetime

from reader import readCSV, readCSV_java02

def convertRegion(region):
    if region == 'ap-northeast-1':
        return 1
    if region == 'us-east-1':
        return 2
    return 3

def print_by_region(data, language):
    """
    Function to print data by region using matplotlib for visualization.
    
    Args:
    - data: The input data frame containing the region and billing duration information.
    - language: The language used to filter the data by region.
    
    Returns:
    - None
    """
    data = data[data[language] == 1]
    asian_data = data[data['region_ap-northeast-1'] == 1]
    us_data = data[data['region_us-east-1'] == 1]
    eu_data = data[data['region_eu-central-1'] == 1]

    grouped_data = asian_data.groupby(['timestamp']).mean()
    plt.plot(grouped_data.index, grouped_data[' billedDuration'], label='Average Asia', c='red')

    grouped_data = eu_data.groupby(['timestamp']).mean()
    plt.plot(grouped_data.index, grouped_data[' billedDuration'], label='Average EU', c='blue')

    grouped_data = us_data.groupby(['timestamp']).mean()
    plt.plot(grouped_data.index, grouped_data[' billedDuration'], label='Average US', c='green')

    plt.xlabel('Timestamp')
    plt.ylabel('Your Data (Average)')
    plt.legend()


    plt.show()

def print_predicted_data(y_pred, y_test):
    """
    Plot the predicted data against the actual data and display the scatter plot with a line representing the perfect prediction.
    Args:
        y_pred: Predicted values
        y_test: Actual values
    Returns:
        None
    """
    plt.figure(figsize=(10, 6))
    plt.scatter(y_test, y_pred)
    plt.plot(np.linspace(0, 50000, 100), np.linspace(0, 50000, 100), label='f(x) = x', c='red')
    plt.xlabel('Actual Values')
    plt.ylabel('Predicted Values')
    plt.legend()

    plt.show()

def print_runtime_data(X_test, y_pred, y_test):

    plt.figure(figsize=(10, 6))
    plt.scatter(X_test['weektime'], y_pred, c='red', label='Predicted')
    plt.scatter(X_test['weektime'], y_test, label='Actual')

    plt.axis('tight')

    plt.xlabel('Weektime')
    plt.ylabel('Billed Duration')
    plt.legend()

    plt.show()

def print_by_date(data):
    """
    Plot a scatter plot of billed duration against timestamp and display it.
    """
    plt.figure(figsize=(10, 6))
    plt.scatter(data['timestamp'], data[' billedDuration'])
    plt.axis('tight')
    plt.plot(np.linspace(0, 50000, 100), np.linspace(0, 50000, 100), label='f(x) = x', c='red')
    plt.xlabel('Timestamp')
    plt.ylabel('Billed Duration')
    plt.legend()

    plt.show()


def plot_function_duration(function_name, save=False):
    """
    Plots the duration of a given function and saves the plot if specified. 

    Args:
        function_name (str): The name of the function to plot.
        save (bool, optional): Whether to save the plot as an image file. Defaults to False.

    Returns:
        None
    """
    DATA_PATH = f"data/{function_name}"
    COLUMNS = [' billedDuration','coldStart','duration','initDuration','maxMemoryUsed','memoryLimitInMB','memorySize','numberOfParallelExecutions','sregion','timestamp']

    data = readCSV(DATA_PATH, COLUMNS) if function_name != 'java02' else readCSV_java02(DATA_PATH, COLUMNS)

    data = data.dropna(how='any')
    data['timestamp'] = data['timestamp'].apply(datetime.fromisoformat)
    data['sregion'] = data['sregion'].apply(convertRegion)
    data = data[data['coldStart'] == True]
    data = data[data['timestamp'] > '2023-12-25']


    asian_data = data[data['sregion'] == 1]
    us_data = data[data['sregion'] == 2]
    eu_data = data[data['sregion'] == 3]

    grouped_data = asian_data.groupby(['timestamp']).median()
    plt.plot(grouped_data.index, grouped_data[' billedDuration'], label='Average Asia', c='red')

    grouped_data = eu_data.groupby(['timestamp']).median()
    plt.plot(grouped_data.index, grouped_data[' billedDuration'], label='Average EU', c='blue')

    grouped_data = us_data.groupby(['timestamp']).mean()
    plt.plot(grouped_data.index, grouped_data[' billedDuration'], label='Average US', c='green')

    plt.xlabel('Timestamp')
    plt.ylabel('Billed Duration')
    plt.title(function_name)
    plt.legend()
    plt.show()

    if save:
       plt.savefig(f"{function_name}_billed_duration_coldstart.png")


def plot_function_duration_by_cold_start(function_list, region):
    """
    Plots the function duration by cold start for each function in the given list, in the specified region.
    
    Args:
        function_list (list): List of function names to plot.
        region (str): The region to filter the data for plotting.
    
    Returns:
        None
    """
    fig, axs = plt.subplots(1, len(function_list), figsize=(9, 3), sharey=True)
    x = 0

    for function_name in function_list:
        DATA_PATH = f"data/{function_name}"
        COLUMNS = [' billedDuration','coldStart','sregion','timestamp']

        data = readCSV(DATA_PATH, COLUMNS) if function_name != 'java02' else readCSV_java02(DATA_PATH, COLUMNS)
        data = data.dropna(how='any')
        data['timestamp'] = data['timestamp'].apply(datetime.fromisoformat)


        data = data[data['sregion'] == region]
        data = data[[' billedDuration','coldStart','timestamp']]
        grouped_data = data.groupby(['timestamp', 'coldStart']).median().reset_index()[['timestamp', 'coldStart',' billedDuration']]

        
        sns.boxplot(x='coldStart', y=' billedDuration', data=grouped_data, ax=axs[x])
        axs[x].set_title(function_name)

        x = x + 1

        print(f"{function_name} Cold Start: {grouped_data[grouped_data['coldStart'] == True][' billedDuration'].mean()/grouped_data[grouped_data['coldStart'] == False][' billedDuration'].mean()}")

    plt.xlabel('Cold Start')
    plt.ylabel('Billed Duration')
    plt.legend()

    plt.show()
    fig.savefig('nodejs_cold_warm_start_boxplot.png')


def plot_function_duration_by_parallization(function_list, region):
    """
    Plots the function duration by parallelization for a list of functions in the specified region.

    Args:
        function_list (list): A list of function names.
        region (str): The region to plot the function duration for.

    Returns:
        None
    """
    fig, axs = plt.subplots(1, len(function_list), figsize=(9, 3), sharey=True)
    x = 0

    for function_name in function_list:
        DATA_PATH = f"data/{function_name}"
        COLUMNS = [' billedDuration','numberOfParallelExecutions','sregion','timestamp', 'coldStart']

        data = readCSV(DATA_PATH, COLUMNS) if function_name != 'java02' else readCSV_java02(DATA_PATH, COLUMNS)
        data = data.dropna(how='any')
        data['timestamp'] = data['timestamp'].apply(datetime.fromisoformat)


        data = data[data['sregion'] == region]
        data = data[[' billedDuration','numberOfParallelExecutions','timestamp']]
        grouped_data = data.groupby(['timestamp', 'numberOfParallelExecutions']).median().reset_index()

        sns.boxplot(x='numberOfParallelExecutions', y=' billedDuration', data=grouped_data, ax=axs[x])
        axs[x].set_title(f"{function_name} in {region}")
        x = x + 1

    plt.xlabel('Number of Parallel Execution')
    plt.ylabel('Billed Duration')
    plt.legend()

    plt.show()
    fig.savefig('java_parallelization_boxplot.png')

node_cols = ['nodejs01','nodejs02','nodejs03','nodejs04','nodejs05']
java_cols = ['java01','java02','java03','java04']

# plot_function_duration('java02')
# plot_function_duration_by_coldStart(java_cols, 'eu-central-1')
    
# plot_function_duration_by_parallization(java_cols, 'us-east-1')

# plot_function_duration('nodejs04')
