from datetime import datetime
import pandas as pd

STD_BOOL_COLUMNS = ['region_ap-northeast-1', 'region_eu-central-1', 'region_us-east-1', 'language_nodejs', 'language_java','coldStart']


def convert_datetime(df):
    df = df.dropna(how='any')
    df['timestamp'] = pd.to_datetime(df['timestamp'], format='mixed')
    df['timestamp'] = df['timestamp'].astype(str)
    df['timestamp'] = df['timestamp'].apply(datetime.fromisoformat)
    df['weektime'] = (
        1e5 * df['timestamp'].dt.weekday +
        df['timestamp'].dt.hour * 3600 +
        df['timestamp'].dt.minute * 60 +
        df['timestamp'].dt.second
    )
    df['rounded_weektime'] = (
        1e5 * df['timestamp'].dt.weekday +
        df['timestamp'].dt.hour * 3600 +
        df['timestamp'].dt.minute
    )
    df['timestamp'] = df['timestamp'].astype(int) // 10**9
    return df

def average_by_timestamp(df):
    # df[['weektime','numberOfParallelExecutions','coldStart', 'maxMemoryUsed', 'fsRead','fsWrite','initDuration','involuntaryContextSwitches','majorPageFault','memoryLimitInMB','minorPageFault','systemCPUTime','unsharedDataSize','unsharedStackSize','userCPUTime','voluntaryContextSwitches']] = df[['weektime','numberOfParallelExecutions','coldStart', 'maxMemoryUsed', 'fsRead','fsWrite','initDuration','involuntaryContextSwitches','majorPageFault','memoryLimitInMB','minorPageFault','systemCPUTime','unsharedDataSize','unsharedStackSize','userCPUTime','voluntaryContextSwitches']].astype(int)
    return df.groupby(['timestamp', 'sregion', 'coldStart','functionName','language']).median().reset_index()

def convert_input(df):
    df = pd.get_dummies(df, columns=['language'], prefix='language')

    # df = average_by_timestamp(df)

    df = pd.get_dummies(df, columns=['sregion'], prefix='region')
    
    bool_columns = ['region_ap-northeast-1', 'region_eu-central-1', 'region_us-east-1', 'language_nodejs', 'language_java','coldStart']
    for col in bool_columns:
        if col not in df.columns:
            df[col] = False
    
    df[bool_columns] = df[bool_columns].astype(int)
    return df

def perform_one_hot_encoding(df, columns):
    """
    Perform one-hot encoding on the specified columns of the given DataFrame.

    Parameters:
    - df: The DataFrame to perform one-hot encoding on.
    - columns: A list of columns to apply one-hot encoding to.

    Returns:
    - The DataFrame with the specified columns one-hot encoded.
    """
    for col in columns:
        prefix = col if col != 'sregion' else 'region'
        df = pd.get_dummies(df, columns=[col], prefix=prefix)
    return df


def convert_bool_columns(df, bool_columns=STD_BOOL_COLUMNS):    
    """
    Converts the boolean columns in the DataFrame `df` to integers.
    
    Parameters:
        df (pandas.DataFrame): The DataFrame to convert.
        bool_columns (list[str]): The list of column names to convert. Defaults to `STD_BOOL_COLUMNS`.
    
    Returns:
        pandas.DataFrame: The DataFrame with the boolean columns converted to integers.
    """
    for col in bool_columns:
        if col not in df.columns:
            df[col] = False
    
    df[bool_columns] = df[bool_columns].astype(int)
    return df


def add_new_data_fields(df):
    """
    Add new data fields to the given DataFrame and calculate the memory usage percentage.
    
    Parameters:
    df (DataFrame): The input DataFrame containing 'maxMemoryUsed' and 'memoryLimitInMB' columns.
    
    Returns:
    DataFrame: The input DataFrame with the new 'memory-usage-percentage' column added.
    """
    df['memory-usage-percentage'] = df['maxMemoryUsed']/df['memoryLimitInMB']
    return df
