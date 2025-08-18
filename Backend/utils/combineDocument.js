export function combineDocument(documents) {
    return documents.map((doc) => doc.pageContent).join('\n\n')
} 