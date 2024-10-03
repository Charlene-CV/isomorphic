import CategoryCard from './category-card';

interface CategoryListProps {
  categories: any[];
  fetchCategories: any;
  fetchAccessorials: any;
}

export default function CategoryList({
  categories,
  fetchCategories,
  fetchAccessorials,
}: CategoryListProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {categories &&
        categories.length &&
        categories.map((category: any) => (
          <div key={category.uuid} className="px-5">
            <CategoryCard
              fetchCategories={fetchCategories}
              name={category.name}
              uuid={category.uuid}
              fetchAccessorials={fetchAccessorials}
            />
          </div>
        ))}
    </div>
  );
}
