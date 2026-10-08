import React, {useMemo, useState} from 'react';
import readExcelFile from 'read-excel-file/browser';
import usePreviewResource from './usePreviewResource';
import PreviewState from './PreviewState';
import styles from './styles.module.css';

const readWorkbook = async (response) => readExcelFile(await response.arrayBuffer());

function columnName(index) {
  let name = '';
  for (let number = index + 1; number > 0; number = Math.floor((number - 1) / 26)) {
    name = String.fromCharCode(65 + ((number - 1) % 26)) + name;
  }
  return name;
}

function cellText(value) {
  if (value == null) return '';
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? '' : value.toISOString().slice(0, 10);
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  return String(value);
}

export default function SpreadsheetPreview({file, url}) {
  const {status, data: sheets, retry} = usePreviewResource(url, readWorkbook);
  const [sheetIndex, setSheetIndex] = useState(0);
  const sheet = sheets?.[sheetIndex] || sheets?.[0];
  const columnCount = useMemo(() => sheet?.data.reduce((count, row) => Math.max(count, row.length), 0) || 0, [sheet]);

  if (status !== 'ready') return <PreviewState status={status} retry={retry} url={url} />;
  if (!sheet) return <PreviewState status="empty" url={url}>这个工作簿没有可显示的工作表</PreviewState>;

  return (
    <div className={styles.workbook}>
      <div className={styles.sheetBar}>
        <div className={styles.sheetTabs} role="tablist" aria-label="工作表">
          {sheets.map((item, index) => (
            <button
              type="button"
              role="tab"
              key={item.sheet}
              id={`material-sheet-tab-${index}`}
              aria-controls="material-sheet-panel"
              aria-selected={index === sheetIndex}
              tabIndex={index === sheetIndex ? 0 : -1}
              className={index === sheetIndex ? styles.activeSheet : undefined}
              onClick={() => setSheetIndex(index)}
              onKeyDown={(event) => {
                let next;
                if (event.key === 'ArrowRight') next = (index + 1) % sheets.length;
                if (event.key === 'ArrowLeft') next = (index + sheets.length - 1) % sheets.length;
                if (event.key === 'Home') next = 0;
                if (event.key === 'End') next = sheets.length - 1;
                if (next === undefined) return;
                event.preventDefault();
                setSheetIndex(next);
                event.currentTarget.parentElement.children[next].focus();
              }}
            >{item.sheet}</button>
          ))}
        </div>
        <span className={styles.sheetMeta}>{sheet.data.length} 行 · {columnCount} 列</span>
      </div>
      <div className={styles.sheetScroller} id="material-sheet-panel" role="tabpanel" aria-labelledby={`material-sheet-tab-${sheetIndex}`} tabIndex={0}>
        {sheet.data.length ? (
          <table className={styles.sheet} aria-label={`${file.name} · ${sheet.sheet}`}>
            <thead>
              <tr><th aria-label="行号" />{Array.from({length: columnCount}, (_, index) => <th key={index} scope="col">{columnName(index)}</th>)}</tr>
            </thead>
            <tbody>
              {sheet.data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <th scope="row">{rowIndex + 1}</th>
                  {Array.from({length: columnCount}, (_, columnIndex) => <td key={columnIndex}>{cellText(row[columnIndex])}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className={styles.emptySheet}>这个工作表是空的</p>}
      </div>
      <p className={styles.sheetHint}>只读预览 · 保留单元格内容，完整排版请下载原文件查看。</p>
    </div>
  );
}
