import pandas as pd
import os

from converter import add_new_data_fields, convert_datetime


NODE_COLUMNS = [' billedDuration','numberOfParallelExecutions','coldStart','timestamp', 'language', 'maxMemoryUsed', 'fsRead','fsWrite','initDuration','involuntaryContextSwitches','majorPageFault','memoryLimitInMB','minorPageFault','systemCPUTime','unsharedDataSize','unsharedStackSize','userCPUTime','voluntaryContextSwitches','sregion','functionName']
JAVA_COLUMNS = [' billedDuration','coldStart','duration','initDuration','language','maxMemoryUsed','memoryLimitInMB','memorySize','numberOfParallelExecutions','sregion','timestamp','functionName']
NODE_TRAIN_COLUMNS = ['weektime','numberOfParallelExecutions','coldStart', 'maxMemoryUsed', 'fsRead','fsWrite','initDuration','involuntaryContextSwitches','majorPageFault','memoryLimitInMB','minorPageFault','systemCPUTime','unsharedDataSize','unsharedStackSize','userCPUTime','voluntaryContextSwitches','region_ap-northeast-1', 'region_eu-central-1', 'region_us-east-1']
JAVA_TRAIN_COLUMNS = ['weektime','memory-usage-percentage','maxMemoryUsed','memoryLimitInMB','coldStart','region_ap-northeast-1', 'region_eu-central-1', 'region_us-east-1', 'numberOfParallelExecutions']
CONVERT_COLUMNS = ['fsRead','fsWrite','initDuration','involuntaryContextSwitches','majorPageFault','memoryLimitInMB','minorPageFault','systemCPUTime','unsharedDataSize','unsharedStackSize','userCPUTime','voluntaryContextSwitches']


def extract_timestamp(input):
    splitted = input.split('_')
    return splitted[2].split('.csv')[0]


def extract_region(input):
    splitted = input.split('_')
    if splitted[1] == 'asia':
        return 'ap-northeast-1'
    if splitted[1] == 'eu':
        return 'eu-central-1'
    if splitted[1] == 'us':
        return 'us-east-1'


def readCSV_java02(folder_path, columns=None):
    """
    Read multiple CSV files from a specified folder path and extract specific columns
    if provided. 
    It extracts additional columns: timestamp, sregion, numberOfParallelExecutions, language, memoryLimitInMB, functionName from the CSV files.

    Args:
        folder_path (str): The path to the folder containing the CSV files.
        columns (list, optional): The list of column names to extract from the CSV files.

    Returns:
        pandas.DataFrame: A DataFrame containing the concatenated data from the CSV files
        with specified columns and without any NaN values.
    """
    all_files = os.listdir(folder_path)
    csv_files = [f for f in all_files if f.endswith('.csv')]

    df_list = []

    for csv in csv_files:
        file_path = os.path.join(folder_path, csv)
        try:
            df = pd.read_csv(file_path)
            df['timestamp'] = extract_timestamp(csv)
            df['sregion'] = extract_region(csv)
            df['numberOfParallelExecutions']  = len(df)
            df['language'] = 'java'
            df['memoryLimitInMB'] = df['memorySize']
            df['functionName'] = 'optFaas-java-dev-java02'
            df_list.append(df)
        except Exception as e:
            print(f"Could not read file {csv} because of error: {e}")

    return pd.concat(df_list, ignore_index=True)[columns].dropna(how='any')


def readCSV(folder_path, columns=None):
    """
    Reads multiple CSV files from a specified folder and concatenates them into a single DataFrame.

    Parameters:
    - folder_path (str): The path to the folder containing CSV files.
    - columns (list, optional): List of column names to select from the concatenated DataFrame. If None, all columns are included. Default is None.

    Returns:
    - pandas.DataFrame: A DataFrame containing the concatenated data from all CSV files in the specified folder.

    Notes:
    - If any CSV file encounters an error during reading, the function prints an error message and continues with the next file.
    - NaN values are dropped from the concatenated DataFrame based on the specified columns.

    Example:
    ```python
    folder_path = '/path/to/csv/files'
    selected_columns = ['column1', 'column2', 'column3']
    result_df = readCSV(folder_path, columns=selected_columns)
    ```

    Raises:
    - FileNotFoundError: If the specified folder_path does not exist.
    - Exception: If an error occurs while reading any CSV file, the error message is printed, and the file is skipped.

    """
    if not os.path.exists(folder_path):
        raise FileNotFoundError(f"The specified folder '{folder_path}' does not exist.")

    all_files = os.listdir(folder_path)
    csv_files = [f for f in all_files if f.endswith('.csv')]

    df_list = []

    for csv in csv_files:
        file_path = os.path.join(folder_path, csv)
        try:
            df = pd.read_csv(file_path)
            df_list.append(df)
        except Exception as e:
            print(f"Could not read file {csv} because of error: {e}")

    concatenated_df = pd.concat(df_list, ignore_index=True)

    if columns is not None:
        concatenated_df = concatenated_df[columns]

    return concatenated_df.dropna(how='any')


def replace_values_except_weektime(df1, df2, node=False):
    """
    Replace values in df1 with values from df2 where the 'weektime' column matches, excluding 'weektime', 'timestamp', ' billedDuration'.

    Parameters:
    - df1: pd.DataFrame, the target DataFrame where values will be replaced
    - df2: pd.DataFrame, the source DataFrame with replacement values

    Returns:
    - pd.DataFrame, the modified DataFrame
    """
    if node:
        df1[CONVERT_COLUMNS] = df1[CONVERT_COLUMNS].astype(int)
        df2[CONVERT_COLUMNS] = df2[CONVERT_COLUMNS].astype(int)

    df2 = df2.groupby(['rounded_weektime', 'coldStart', 'functionName']).mean().reset_index()
    
    merged_df = pd.merge(df1[['rounded_weektime', 'timestamp', 'weektime', ' billedDuration', 'coldStart', 'region_ap-northeast-1', 'region_eu-central-1', 'region_us-east-1', 'functionName']], df2, on=['weektime', 'coldStart', 'functionName'], how='left', suffixes=('', '_df2'))
    return merged_df.dropna(how='any')


def replace_values_based_on_weektime(df1, df2, node=False):
    """
    Replace values in df1 with values from df2 where the 'weektime' column matches, excluding 'weektime', 'timestamp', ' billedDuration'.

    Parameters:
    - df1: pd.DataFrame, the target DataFrame where values will be replaced
    - df2: pd.DataFrame, the source DataFrame with replacement values

    Returns:
    - pd.DataFrame, the modified DataFrame
    """

    if node:
        df1[CONVERT_COLUMNS] = df1[CONVERT_COLUMNS].astype(int)
        df2[CONVERT_COLUMNS] = df2[CONVERT_COLUMNS].astype(int)
    df2 = df2.groupby(['rounded_weektime', 'region_ap-northeast-1', 'region_eu-central-1', 'region_us-east-1', 'coldStart', 'functionName']).mean().reset_index()
    merged_df = pd.merge(df1[['rounded_weektime', 'timestamp', 'weektime', ' billedDuration', 'coldStart', 'region_ap-northeast-1', 'region_eu-central-1', 'region_us-east-1', 'functionName']], df2, on=['rounded_weektime', 'region_ap-northeast-1', 'region_eu-central-1', 'region_us-east-1', 'coldStart', 'functionName'], how='inner', suffixes=('', '_df2'))
    return merged_df


def read_functions_data(function_list):
    """
    Reads data from a list of function names and returns a concatenated DataFrame.

    Args:
        function_list (list): A list of function names.

    Returns:
        pd.DataFrame: A concatenated DataFrame containing the data from all the function names.
    """
    df_list = []
    for function_name in function_list:
        COLUMNS = JAVA_COLUMNS if 'java' in function_name else NODE_COLUMNS
        READER = readCSV if 'java02' != function_name else readCSV_java02
        DATA_PATH = f"data/{function_name}"

        df_list.append(add_new_data_fields(convert_datetime(READER(DATA_PATH, COLUMNS))))

    return pd.concat(df_list, ignore_index=True)
