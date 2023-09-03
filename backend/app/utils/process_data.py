import pandas as pd


def fill_missing_days(rows: list[dict], cols: list[str], date_col: str) -> pd.DataFrame:
    df_raw = pd.DataFrame(rows, columns=cols)
    df = (
        df_raw
        .assign(date_col=pd.to_datetime(df_raw[date_col]))
        .set_index(date_col)
    )
    new_index = pd.date_range(start=df.index.min(), end=df.index.max(), freq='D')
    return (
        df
        .reindex(new_index, fill_value=0)
        .reset_index()
        .rename(columns={'index': date_col})
    )


def transform_to_cumulative(df: pd.DataFrame, cols_to_accumulate: list[str]) -> pd.DataFrame:
    df_copy = df.copy()
    for col in cols_to_accumulate:
        df_copy[col] = df_copy[col].cumsum()
    return df_copy