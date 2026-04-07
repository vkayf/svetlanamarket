export type Language = 'ru' | 'uz';

const translations: Record<string, Record<Language, string>> = {
  'app.title': { ru: 'SVETLANA MARKET', uz: 'SVETLANA MARKET' },
  'nav.dashboard': { ru: 'Главная', uz: 'Bosh sahifa' },
  'nav.products': { ru: 'Товары', uz: 'Mahsulotlar' },
  'nav.operations': { ru: 'Операции', uz: 'Operatsiyalar' },
  'nav.cash': { ru: 'Касса', uz: 'Kassa' },
  'nav.credits': { ru: 'Долги', uz: 'Qarzlar' },
  'nav.analytics': { ru: 'Аналитика', uz: 'Analitika' },
  'nav.settings': { ru: 'Настройки', uz: 'Sozlamalar' },
  'nav.chat': { ru: 'Чат', uz: 'Chat' },
  
  'action.sell': { ru: 'Продать', uz: 'Sotish' },
  'action.stock_in': { ru: 'Приход', uz: 'Kirim' },
  'action.stock_out': { ru: 'Расход', uz: 'Chiqim' },
  'action.correction': { ru: 'Коррекция', uz: 'Tuzatish' },
  'action.search': { ru: 'Поиск', uz: 'Qidirish' },
  'action.add': { ru: 'Добавить', uz: 'Qo\'shish' },
  'action.edit': { ru: 'Изменить', uz: 'Tahrirlash' },
  'action.delete': { ru: 'Удалить', uz: 'O\'chirish' },
  'action.save': { ru: 'Сохранить', uz: 'Saqlash' },
  'action.cancel': { ru: 'Отмена', uz: 'Bekor qilish' },
  'action.confirm': { ru: 'Подтвердить', uz: 'Tasdiqlash' },
  'action.send': { ru: 'Отправить', uz: 'Yuborish' },
  'action.close': { ru: 'Закрыть', uz: 'Yopish' },

  'product.name': { ru: 'Название', uz: 'Nomi' },
  'product.category': { ru: 'Категория', uz: 'Kategoriya' },
  'product.cost_price': { ru: 'Себестоимость', uz: 'Tan narxi' },
  'product.sell_price': { ru: 'Цена продажи', uz: 'Sotish narxi' },
  'product.stock': { ru: 'Остаток', uz: 'Qoldiq' },
  'product.min_stock': { ru: 'Мин. остаток', uz: 'Min. qoldiq' },
  'product.supplier': { ru: 'Поставщик', uz: 'Yetkazuvchi' },
  'product.supplier_telegram': { ru: 'Telegram поставщика', uz: 'Yetkazuvchi Telegram' },
  'product.low_stock': { ru: 'Мало на складе', uz: 'Kam qolgan' },
  'product.all': { ru: 'Все товары', uz: 'Barcha mahsulotlar' },

  'cash.revenue': { ru: 'Выручка', uz: 'Tushum' },
  'cash.expense': { ru: 'Расход', uz: 'Xarajat' },
  'cash.withdrawal': { ru: 'Снятие', uz: 'Yechib olish' },
  'cash.balance': { ru: 'Баланс', uz: 'Balans' },
  'cash.description': { ru: 'Описание', uz: 'Tavsif' },

  'credit.customer': { ru: 'Клиент', uz: 'Mijoz' },
  'credit.amount': { ru: 'Сумма', uz: 'Summa' },
  'credit.status': { ru: 'Статус', uz: 'Holat' },
  'credit.pending': { ru: 'Ожидает', uz: 'Kutilmoqda' },
  'credit.paid': { ru: 'Оплачено', uz: 'To\'langan' },
  'credit.overdue': { ru: 'Просрочено', uz: 'Muddati o\'tgan' },

  'analytics.revenue': { ru: 'Выручка', uz: 'Tushum' },
  'analytics.profit': { ru: 'Прибыль', uz: 'Foyda' },
  'analytics.low_stock': { ru: 'Мало на складе', uz: 'Kam qolgan' },
  'analytics.top_products': { ru: 'Топ товары', uz: 'Top mahsulotlar' },
  'analytics.suggestions': { ru: 'Рекомендации', uz: 'Tavsiyalar' },

  'voice.start': { ru: 'Голосовой ввод', uz: 'Ovozli kiritish' },
  'voice.listening': { ru: 'Слушаю...', uz: 'Tinglayapman...' },
  'voice.stop': { ru: 'Остановить', uz: 'To\'xtatish' },
  'voice.not_supported': { ru: 'Голос не поддерживается', uz: 'Ovoz qo\'llab-quvvatlanmaydi' },

  'status.loading': { ru: 'Загрузка...', uz: 'Yuklanmoqda...' },
  'status.error': { ru: 'Ошибка', uz: 'Xatolik' },
  'status.empty': { ru: 'Нет данных', uz: 'Ma\'lumot yo\'q' },
  'status.success': { ru: 'Успешно', uz: 'Muvaffaqiyatli' },

  'quantity': { ru: 'Количество', uz: 'Miqdor' },
  'date': { ru: 'Дата', uz: 'Sana' },
  'type': { ru: 'Тип', uz: 'Turi' },
  'note': { ru: 'Примечание', uz: 'Izoh' },
  'total': { ru: 'Итого', uz: 'Jami' },
  'today': { ru: 'Сегодня', uz: 'Bugun' },
  'alerts': { ru: 'Уведомления', uz: 'Bildirishnomalar' },

  'telegram.generate_order': { ru: 'Сформировать заказ', uz: 'Buyurtma yaratish' },
  'telegram.order_text': { ru: 'Текст заказа для Telegram', uz: 'Telegram uchun buyurtma matni' },
  'telegram.copy': { ru: 'Скопировать', uz: 'Nusxa olish' },
};

export function t(key: string, lang: Language): string {
  return translations[key]?.[lang] || key;
}

export function getCategories(lang: Language): string[] {
  if (lang === 'uz') {
    return ['Ichimliklar', 'Sut mahsulotlari', 'Non', 'Go\'sht', 'Sabzavotlar', 'Mevalar', 'Konserva', 'Snek', 'Maishiy kimyo', 'Boshqa'];
  }
  return ['Напитки', 'Молочные', 'Хлеб', 'Мясо', 'Овощи', 'Фрукты', 'Консервы', 'Снеки', 'Бытовая химия', 'Прочее'];
}
