interface PageHeaderProps {
  title: string;
  description: string;
}

export default function PageHeader({
  title,
  description,
}: PageHeaderProps) {
  return (
    <section className="border-b bg-green-50">
      <div className="mx-auto max-w-7xl px-6 py-8 text-center">
        <h1 className="text-3xl font-semibold text-green-900">
          {title}
        </h1>

        <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-600">
          {description}
        </p>
      </div>
    </section>
  );
}