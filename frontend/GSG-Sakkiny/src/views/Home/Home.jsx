import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { getApartments } from "../../api/getApartments";
import { ApartmentCard, SearchBar } from "../../components";
import { Footer } from "../Footer";
import { Navbar } from "../Navbar";

export const Home = () => {
  // إعداد معالجة الخطأ للاستعلام
  const { data, error, fetchNextPage, hasNextPage, status } = useInfiniteQuery({
    queryKey: ["apartments"],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const result = await getApartments({ pageParam });
        return result;
      } catch (error) {
        console.error("Error fetching apartments:", error);
        // إرجاع هيكل بيانات افتراضي عند حدوث خطأ
        return { apartments: [] };
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      // فحص إذا كانت lastPage محددة وتحتوي على apartments
      if (!lastPage || !lastPage.apartments || lastPage.apartments.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    // إضافة معالجة خطأ للاستعلام
    retry: 1,
    retryDelay: 1000,
    // تقديم بيانات افتراضية عند فشل الاستعلام
    placeholderData: { pages: [{ apartments: [] }] }
  });

  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    // تحديث نتائج البحث فقط عندما تكون البيانات موجودة
    if (data) {
      setSearchResults(data);
    }
  }, [data]);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isSearching) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isSearching]);

  // إعداد احتياطي للصفحات والشقق
  const renderApartments = () => {
    if (!searchResults || !searchResults.pages) {
      return <p>لا توجد بيانات للعرض</p>;
    }

    return searchResults.pages.map((page, pageIndex) => {
      // التحقق من وجود صفحة وشقق قبل محاولة الوصول إليها
      if (!page || !page.apartments) {
        return <p key={`empty-page-${pageIndex}`}>صفحة فارغة</p>;
      }

      if (page.apartments.length === 0) {
        return <p key={`no-apartments-page-${pageIndex}`}></p>;
      }

      return page.apartments.map((apartment) => (
        <ApartmentCard
          key={apartment.id}
          id={apartment.id}
          title={apartment.title}
          subtitle={apartment.subTitle}
          location={apartment.location}
          image={apartment.image || "placeholder-image.jpg"} // إضافة صورة احتياطية
        />
      ));
    });
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col justify-center items-center">
        <SearchBar
          setSearchResults={setSearchResults}
          setIsSearching={setIsSearching}
        />
        <section className="min-h-screen flex-1 p-9 flex flex-wrap gap-4 justify-center">
          {status === "pending" ? (
            <p>جاري التحميل...</p>
          ) : status === "error" ? (
            <div>
              <p>خطأ في تحميل البيانات: {error?.message || "خطأ غير معروف"}</p>
              <p>يرجى التحقق من اتصال API والمحاولة مرة أخرى</p>
            </div>
          ) : (
            renderApartments()
          )}
        </section>
        <div ref={ref}></div>
      </main>
      <Footer />
    </div>
  );
};