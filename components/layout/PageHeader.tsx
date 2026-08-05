interface PageHeaderProps {
  title: string;
  description: string;
}

export default function PageHeader({
  title,
  description,
}: PageHeaderProps) {
  return (
    <section className="bg-green-50 border-b">
      <div className="mx-auto max-w-7xl px-6 py-16 text-center">
        <h1 className="text-4xl font-bold text-green-900">
          {title}
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          {description}
        </p>
      </div>
    </section>
  );
}