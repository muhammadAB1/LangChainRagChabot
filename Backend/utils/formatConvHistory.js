export function formatConvHistory(messages) {
    if(messages.length > 0){
        return messages.map((messages, i) => {
            if (i % 2 === 0)
                return `Human: ${messages}`
            else
                return `AI: ${messages}`
        }).join('\n')
    }
}