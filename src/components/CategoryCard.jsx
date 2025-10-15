function CategoryCard({ emoji, name, category }) {
  return (
    <div className={`categoria-card ${category}`}>
      <span className="categoria-emoji">{emoji}</span>
      <span className="categoria-nombre">{name}</span>
    </div>
  );
}

export default CategoryCard;