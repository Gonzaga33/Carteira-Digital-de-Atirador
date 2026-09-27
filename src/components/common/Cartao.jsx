export default function Cartao({ children, className = '', as: Tag = 'div', ...resto }) {
  return (
    <Tag
      className={`rounded-2xl border border-tinta-700 bg-tinta-900 p-4 shadow-lg shadow-black/20 ${className}`}
      {...resto}
    >
      {children}
    </Tag>
  )
}
