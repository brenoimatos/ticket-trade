import pandas as pd


def fill_missing_days(rows, cols: list[str], date_col: str):
    df = pd.DataFrame(rows, columns=cols)
    df[date_col] = pd.to_datetime(df[date_col])
    df.set_index(date_col, inplace=True)
    
    new_index = pd.date_range(start=df.index.min(), end=df.index.max(), freq='D')
    df = df.reindex(new_index, fill_value=0)
    
    df.reset_index(inplace=True)
    df.rename(columns={'index': date_col}, inplace=True)
    
    return df.to_dict(orient='records')