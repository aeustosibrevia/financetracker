export const formatAmount = (value) => {
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export const getToday = () => {
  return new Date().toLocaleDateString('sv-SE')
}

export const getCurrentMonth = () => {
  return getToday().slice(0, 7)
}
