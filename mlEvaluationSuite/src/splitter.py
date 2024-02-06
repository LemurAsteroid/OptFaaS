STD_TRAIN_COLUMNS = ['weektime','memory-usage-percentage','maxMemoryUsed','memoryLimitInMB','coldStart','region_ap-northeast-1', 'region_eu-central-1', 'region_us-east-1', 'numberOfParallelExecutions']
STD_TARGET_COLUMN = ' billedDuration'

def get_features(df, TRAIN_COLUMNS=STD_TRAIN_COLUMNS, TARGET_COLUMN=STD_TARGET_COLUMN):
    """
    Extracts features and target variable from a DataFrame based on specified column names.

    Parameters:
    - df (pandas.DataFrame): The DataFrame containing the data.
    - TRAIN_COLUMNS (list, optional): List of column names representing the features. Default is STD_TRAIN_COLUMNS.
    - TARGET_COLUMN (str, optional): The column name representing the target variable. Default is STD_TARGET_COLUMN.

    Returns:
    - tuple: A tuple containing two components - (features, target).
        - features (pandas.DataFrame): The DataFrame containing the selected feature columns.
        - target (pandas.Series): The Series containing the target variable column.

    Example:
    ```python
    import pandas as pd

    # Assuming 'feature1', 'feature2', and 'target' are columns in your DataFrame
    df = pd.DataFrame({'feature1': [1, 2, 3], 'feature2': [4, 5, 6], 'target': [0, 1, 0]})

    features, target = get_features(df)
    ```

    Raises:
    - KeyError: If any specified column name (TRAIN_COLUMNS or TARGET_COLUMN) is not present in the DataFrame.

    """
    if not set(TRAIN_COLUMNS + [TARGET_COLUMN]).issubset(df.columns):
        missing_columns = set(TRAIN_COLUMNS + [TARGET_COLUMN]) - set(df.columns)
        raise KeyError(f"The following columns are not present in the DataFrame: {missing_columns}")

    features = df[TRAIN_COLUMNS].dropna(how='any')
    target = df[TARGET_COLUMN].dropna(how='any')

    return features, target


def split_by_date(df, quantile=0.8):
    """
    Splits a DataFrame into training and testing sets based on a specified timestamp column.

    Parameters:
    - df (pandas.DataFrame): The DataFrame containing the data to be split.
    - quantile (float, optional): The quantile value used to determine the split timestamp. Should be between 0 and 1. Default is 0.8.

    Returns:
    - tuple: A tuple containing two DataFrames - (train_data, test_data).
        - train_data (pandas.DataFrame): The training set with rows up to the specified quantile timestamp.
        - test_data (pandas.DataFrame): The testing set with rows after the specified quantile timestamp.

    Notes:
    - The DataFrame is sorted based on the 'timestamp' column before the split.
    - The split timestamp is determined by the specified quantile value.
    - The resulting DataFrames are reset to have continuous index values.

    Raises:
    - ValueError: If the quantile value is not between 0 and 1.
    - KeyError: If the 'timestamp' column is not present in the DataFrame.

    """
    if not (0 < quantile < 1):
        raise ValueError("Quantile value should be between 0 and 1.")

    if 'timestamp' not in df.columns:
        raise KeyError("The 'timestamp' column is not present in the DataFrame.")

    df = df.sort_values(by='timestamp')
    split_timestamp = df['timestamp'].quantile(quantile)

    train_data = df[df['timestamp'] <= split_timestamp]
    test_data = df[df['timestamp'] > split_timestamp]

    return train_data.reset_index(drop=True), test_data.reset_index(drop=True)


def split_by_region(df, region):
    """
    Splits a DataFrame into training and testing sets based on a specified region column.

    Parameters:
    - df (pandas.DataFrame): The DataFrame containing the data to be split.
    - region (str): The region identifier for which the split is performed. It is used to filter rows based on the specified region column.

    Returns:
    - tuple: A tuple containing two DataFrames - (train_data, test_data).
        - train_data (pandas.DataFrame): The training set with rows not belonging to the specified region.
        - test_data (pandas.DataFrame): The testing set with rows belonging to the specified region.

    Example:
    ```python
    import pandas as pd

    # Assuming 'region_A', 'region_B', and 'value' are columns in your DataFrame
    df = pd.DataFrame({'region_A': [1, 0, 1, 0], 'region_B': [0, 1, 0, 1], 'value': [10, 20, 30, 40]})

    region_to_split = 'A'
    train_set, test_set = split_by_region(df, region_to_split)
    ```

    Raises:
    - KeyError: If the specified region column (e.g., 'region_A') is not present in the DataFrame.
    - ValueError: If the specified region identifier is not found in the specified region column.

    """
    region_column = f"region_{region}"

    if region_column not in df.columns:
        raise KeyError(f"The specified region column '{region_column}' is not present in the DataFrame.")

    if df[region_column].nunique() < 2:
        raise ValueError(f"The specified region identifier '{region}' is not found in the '{region_column}' column.")

    train_data = df[df[region_column] != 1]
    test_data = df[df[region_column] == 1]

    return train_data.reset_index(drop=True), test_data.reset_index(drop=True)


def split_by_function(df, function_name):
    function_name = f"optFaas-nodejs-dev-{function_name}" if 'nodejs' in function_name else f"optFaas-java-dev-{function_name}" 
    train_data = df[df['functionName'] != function_name]
    test_data = df[df['functionName'] == function_name]

    return train_data.reset_index(drop=True), test_data.reset_index(drop=True)
