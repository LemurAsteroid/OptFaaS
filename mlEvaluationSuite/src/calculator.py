from reader import readCSV, readCSV_java02
from converter import convert_datetime, convert_input
from data_plot import convertRegion
import numpy as np
import pandas as pd


def calc_avg_gained_duration_benefit(min_duration, actual_duration):
    merged = pd.merge(min_duration, actual_duration, how='inner', on=['rounded_weektime', 'coldStart', 'functionName'], suffixes=('_min', '_act'), validate="many_to_many")
    gain = merged[' billedDuration_act'] - merged[' billedDuration_min']
    return np.average(gain)


def calc_max_duration_gain(function_name):
    DATA_PATH = f"data/{function_name}"
    COLUMNS = [' billedDuration','coldStart','sregion','timestamp', 'functionName']

    # TEST_DATA = readCSV_with_missing_fields(DATA_PATH, JAVA_COLUMNS)
    TEST_DATA = readCSV(DATA_PATH, COLUMNS)


    TEST_DATA = TEST_DATA.dropna(how='any')
    TEST_DATA = convert_datetime(TEST_DATA)
    TEST_DATA['sregion'] = TEST_DATA['sregion'].apply(convertRegion)
    TEST_DATA = TEST_DATA.groupby(['timestamp', 'sregion', 'coldStart', 'functionName']).mean().reset_index()

    asian_data = TEST_DATA[TEST_DATA['sregion'] == 1]
    us_data = TEST_DATA[TEST_DATA['sregion'] == 2]
    eu_data = TEST_DATA[TEST_DATA['sregion'] == 3]

    asia_avg = asian_data.groupby(['timestamp', 'coldStart', 'functionName']).mean().reset_index()[['timestamp', ' billedDuration', 'sregion', 'coldStart', 'functionName']]
    eu_avg = eu_data.groupby(['timestamp', 'coldStart', 'functionName']).mean().reset_index()[['timestamp', ' billedDuration', 'sregion', 'coldStart', 'functionName']]
    us_avg = us_data.groupby(['timestamp', 'coldStart', 'functionName']).mean().reset_index()[['timestamp', ' billedDuration', 'sregion', 'coldStart', 'functionName']]

    max_duration = TEST_DATA.loc[TEST_DATA.groupby(['timestamp', 'coldStart', 'functionName'])[' billedDuration'].idxmax()].reset_index()[['timestamp', ' billedDuration', 'sregion', 'coldStart', 'functionName']]
    min_duration = TEST_DATA.loc[TEST_DATA.groupby(['timestamp', 'coldStart', 'functionName'])[' billedDuration'].idxmin()].reset_index()[['timestamp', ' billedDuration', 'sregion', 'coldStart', 'functionName']]

    overall_average_runtime = TEST_DATA[' billedDuration'].mean()

    max_benefit = calc_avg_gained_duration_benefit(min_duration, max_duration)
    print(f"Max benefit {max_benefit} (ms per Execution)")
    print(f"Relative benefit {max_benefit / overall_average_runtime} (% per Execution)")

    print(f"Difference to Best Option when only use Asia: {calc_avg_gained_duration_benefit(min_duration, asia_avg)} (ms per Execution)")
    print(f"Difference to Best Option when only use Europe: {calc_avg_gained_duration_benefit(min_duration, eu_avg)} (ms per Execution)")
    print(f"Difference to Best Option when only use US: {calc_avg_gained_duration_benefit(min_duration, us_avg)} (ms per Execution)")
    
    return min_duration


def evaluate_max_performance_benefit(function_name):
    DATA_PATH = f"data/{function_name}"
    COLUMNS = [' billedDuration','coldStart','sregion','timestamp', 'functionName', 'language']

    TEST_DATA = readCSV_java02(DATA_PATH, COLUMNS)
    # TEST_DATA = readCSV(DATA_PATH, COLUMNS)


    TEST_DATA = TEST_DATA.dropna(how='any')
    df = convert_input(convert_datetime(TEST_DATA))

    df = df.groupby(['rounded_weektime', 'region_ap-northeast-1', 'region_eu-central-1', 'region_us-east-1', 'coldStart', 'functionName']).mean().reset_index()

    min_duration = df.loc[df.groupby(['rounded_weektime', 'coldStart', 'functionName'])[' billedDuration'].idxmin()].reset_index()[['rounded_weektime', ' billedDuration', 'coldStart', 'functionName']]
    max_duration = df.loc[df.groupby(['rounded_weektime', 'coldStart', 'functionName'])[' billedDuration'].idxmax()].reset_index()[['rounded_weektime', ' billedDuration', 'coldStart', 'functionName', 'region_ap-northeast-1', 'region_eu-central-1', 'region_us-east-1']]
    avg_duration_by_fun = df.groupby(['functionName'])[' billedDuration'].mean().reset_index()[['functionName', ' billedDuration']]
    asia_duration = df[df['region_ap-northeast-1'] == 1].reset_index()
    us_duration = df[df['region_us-east-1'] == 1].reset_index()
    eu_duration = pd.merge(df[df['region_eu-central-1'] == 1].reset_index(), min_duration, how='inner', on=['rounded_weektime', 'coldStart', 'functionName'], suffixes=('', '_minimum'), validate="many_to_many")
    max_duration = pd.merge(max_duration, eu_duration, how='inner', on=['rounded_weektime', 'coldStart', 'functionName'], suffixes=('', '_eu'), validate="many_to_many")
    max_duration = pd.merge(max_duration, us_duration, how='inner', on=['rounded_weektime', 'coldStart', 'functionName'], suffixes=('', '_us'), validate="many_to_many")
    max_duration = pd.merge(max_duration, asia_duration, how='inner', on=['rounded_weektime', 'coldStart', 'functionName'], suffixes=('', '_as'), validate="many_to_many")


    gain_per_fun = []
    gain_asia = []
    gain_us = []
    gain_eu = []
    for fun in df.groupby('functionName').max().reset_index()['functionName']:
        avg_dur = avg_duration_by_fun[avg_duration_by_fun['functionName'] == fun][' billedDuration'].mean()
        max_dur = calc_avg_gained_duration_benefit(min_duration[min_duration['functionName'] == fun], max_duration[max_duration['functionName'] == fun])
        gain_asia = calc_avg_gained_duration_benefit(asia_duration[asia_duration['functionName'] == fun], max_duration[max_duration['functionName'] == fun])
        gain_us = calc_avg_gained_duration_benefit(us_duration[us_duration['functionName'] == fun], max_duration[max_duration['functionName'] == fun])
        gain_eu = calc_avg_gained_duration_benefit(eu_duration[eu_duration['functionName'] == fun], max_duration[max_duration['functionName'] == fun])
        # print(f"\n {max_dur} & {max_dur/avg_dur} & {gain_asia} & {gain_asia/avg_dur} & {gain_us} & {gain_us/avg_dur} & {gain_eu} & {gain_eu/avg_dur} \\")
        print(f"\n {max_dur:.2f} & {max_dur/avg_dur:.2f} & {gain_asia:.2f} & {gain_asia/avg_dur:.2f} & {gain_us:.2f} & {gain_us/avg_dur:.2f} & {gain_eu:.2f} & {gain_eu/avg_dur:.2f} \\")

    print(f"Max gain {np.average(gain_per_fun)} (% per Execution)")
    print(f"Performance gain in Asia {np.average(gain_asia)} (% per Execution)")
    print(f"Performance gain in US {np.average(gain_us)} (% per Execution)")
    print(f"Performance gain in EU {np.average(gain_eu)} (% per Execution)")


def evaluate_performance_benefit(df, y_pred):
    df['predictedDuration'] = y_pred
    df = df.groupby(['rounded_weektime', 'region_ap-northeast-1', 'region_eu-central-1', 'region_us-east-1', 'coldStart', 'functionName']).mean().reset_index()

    min_duration = df.loc[df.groupby(['rounded_weektime', 'coldStart', 'functionName'])[' billedDuration'].idxmin()].reset_index()[['rounded_weektime', ' billedDuration', 'coldStart', 'functionName']]
    max_duration = df.loc[df.groupby(['rounded_weektime', 'coldStart', 'functionName'])[' billedDuration'].idxmax()].reset_index()[['rounded_weektime', ' billedDuration', 'coldStart', 'functionName', 'region_ap-northeast-1', 'region_eu-central-1', 'region_us-east-1']]
    avg_duration_by_fun = df.groupby(['functionName'])[' billedDuration'].mean().reset_index()[['functionName', ' billedDuration']]
    pred_min_duration = df.loc[df.groupby(['rounded_weektime', 'coldStart', 'functionName'])['predictedDuration'].idxmin()].reset_index()[['rounded_weektime', ' billedDuration', 'coldStart', 'functionName']]
    asia_duration = df[df['region_ap-northeast-1'] == 1].reset_index()
    us_duration = df[df['region_us-east-1'] == 1].reset_index()
    eu_duration = pd.merge(df[df['region_eu-central-1'] == 1].reset_index(), min_duration, how='inner', on=['rounded_weektime', 'coldStart', 'functionName'], suffixes=('', '_minimum'), validate="many_to_many")
    max_duration = pd.merge(max_duration, eu_duration, how='inner', on=['rounded_weektime', 'coldStart', 'functionName'], suffixes=('', '_eu'), validate="many_to_many")
    max_duration = pd.merge(max_duration, us_duration, how='inner', on=['rounded_weektime', 'coldStart', 'functionName'], suffixes=('', '_us'), validate="many_to_many")
    max_duration = pd.merge(max_duration, asia_duration, how='inner', on=['rounded_weektime', 'coldStart', 'functionName'], suffixes=('', '_as'), validate="many_to_many")

    gain_per_fun = []
    gain_per_fun_pred = []
    gain_asia = []
    gain_us = []
    gain_eu = []
    for fun in df.groupby('functionName').max().reset_index()['functionName']:
        avg_dur = avg_duration_by_fun[avg_duration_by_fun['functionName'] == fun][' billedDuration']
        gain_per_fun.append(calc_avg_gained_duration_benefit(min_duration[min_duration['functionName'] == fun], max_duration[max_duration['functionName'] == fun]) / avg_dur)
        gain_per_fun_pred.append(calc_avg_gained_duration_benefit(pred_min_duration[pred_min_duration['functionName'] == fun], max_duration[max_duration['functionName'] == fun]) / avg_dur)
        gain_asia.append(calc_avg_gained_duration_benefit(asia_duration[asia_duration['functionName'] == fun], max_duration[max_duration['functionName'] == fun]) / avg_dur)
        gain_us.append(calc_avg_gained_duration_benefit(us_duration[us_duration['functionName'] == fun], max_duration[max_duration['functionName'] == fun]) / avg_dur)
        gain_eu.append(calc_avg_gained_duration_benefit(eu_duration[eu_duration['functionName'] == fun], max_duration[max_duration['functionName'] == fun]) / avg_dur)
    

    print(f"Avg gain of prediction {np.average(gain_per_fun_pred)} (% per Execution)")
    print(f"Max gain {np.average(gain_per_fun)} (% per Execution)")
    print(f"Performance gain in Asia {np.average(gain_asia)} (% per Execution)")
    print(f"Performance gain in US {np.average(gain_us)} (% per Execution)")
    print(f"Performance gain in EU {np.average(gain_eu)} (% per Execution)")

    return np.average(gain_per_fun_pred)
