// Export service: JSON and CSV export helpers

export function toJSON(data: any, filename = 'export.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function objectToCsvRow(obj: Record<string, any>, keys: string[]) {
  return keys
    .map(k => {
      const val = obj[k];
      if (val === null || val === undefined) return '';
      const s = String(val).replace(/"/g, '""');
      if (s.search(/\,|\"|\n/) >= 0) return `"${s}"`;
      return s;
    })
    .join(',');
}

export function toCSV(items: any[], filename = 'export.csv') {
  if (!items || !items.length) {
    toJSON([], filename.replace(/\.csv$/, '.json'));
    return;
  }

  // Collect union of keys from all objects (preserve order from first item)
  const keys = Array.from(
    items.reduce((acc, it) => {
      Object.keys(it).forEach(k => acc.add(k));
      return acc;
    }, new Set<string>(Object.keys(items[0])))
  );

  const header = keys.join(',');
  const rows = items.map(it => objectToCsvRow(it, keys));
  const csv = [header, ...rows].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
