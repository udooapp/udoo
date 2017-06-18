import {LOCALE_ID, TRANSLATIONS, TRANSLATIONS_FORMAT} from "@angular/core";
export function getTranslationProviders(): Promise<Object[]> {

  // Get the locale id from the global
  const locale = document['locale'] as string;
  console.log('Locale: ' + locale);

  // return no providers if fail to get translation file for locale
  const noProviders: Object[] = [];

  // No locale or English: no translation providers
  if (!locale || locale === 'en') {
    return Promise.resolve(noProviders);
  }

  // Ex: 'locale/messages.de.xlf`
  const translationFile = `./locale/messages.${locale}.xlf`;

  return getTranslationsWithSystemJs(translationFile)
    .then( (translations: string ) => [
      { provide: TRANSLATIONS, useValue: translations },
      { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' },
      { provide: LOCALE_ID, useValue: locale }
    ])
    .catch(() => noProviders); // ignore if file not found
}

declare var System: any;

function getTranslationsWithSystemJs(file: string) {
  return System.import(file + '!text'); // relies on text plugin
}
