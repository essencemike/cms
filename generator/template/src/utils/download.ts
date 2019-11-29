export function downloadStream(data: any, filename: string, mine: string = 'application/octet-stream') {
  const blob = new Blob([data], { type: mine });

  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    const blobURL = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = blobURL;
    link.setAttribute('download', filename);

    if (typeof link.download === 'undefined') {
      link.setAttribute('target', '_blank');
    }

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobURL);
  }
}

export function downloadLink(url: string, filename: string) {
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.setAttribute('download', String(filename));

  if (typeof link.download === 'undefined') {
    link.setAttribute('target', '_blank');
  }

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function blobToJSON(blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = (e: any) => resolve(JSON.parse(e.target.result));
    reader.onerror = (error: any) => reject(error);

    reader.readAsText(blob);
  });
}
