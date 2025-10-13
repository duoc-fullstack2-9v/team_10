function CategoryDescription({ title, description }) {
  return (
    <div className="desc-cat-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default CategoryDescription;