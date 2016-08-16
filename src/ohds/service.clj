(ns ohds.service
  (:require [clojure.java.io :as io]
            [clojure.edn :as edn]
            [clj-http.client :as client]
            [cheshire.core :refer :all]))

(defn get-config []
  (->> "config.edn"
       io/resource
       slurp
       edn/read-string))

(def config (atom (get-config)))

(def auth-header
  (let [{:keys [api-user api-password]} @config]
    {:basic-auth [api-user api-password]}))

(defn post-header
  [body]
  (merge auth-header
         {:content-type :json
          :body (generate-string body)}))

(defn gen-url
  [path]
  (let [host (:openhds-rest @config)]
    (str host path)))

(defn parse-body
  "Extracts JSON body from http response and reformats as edn"
  [response]
  (-> response
      :body
      (parse-string true)))

(defn http-post
  [url body]
  (client/post (gen-url url)
               (post-header body)))

(defn http-get
  [url]
  (client/get (gen-url url)
              auth-header))

(defn create-entity
  [url body]
  (println "in create entity" url body)
  (-> url
      (http-post body)
      parse-body
      :uuid))

(defn get-entity
  "Get entities at url identified by key.
   optional keys to further describe entity"
  [url key & keys]
  (let [entity-keys (into []
                          (concat [:uuid :extId] keys))]
    (->> url
         http-get
         parse-body
         :_embedded
         key
         (map #(select-keys % entity-keys)))))

(defn get-one
  [url uuid]
  (let [path (str url "/" uuid ".json")]
    (parse-body (http-get path))))

(defn get-some
  "Get entities by locationHierarchy"
  [url hierarchy-id]
  (-> url
      (str "/bylocationhierarchy.json?locationHierarchyUuid=" hierarchy-id)
      http-get
      parse-body
      :content))

(comment
  (get-entity "/locations.bulk" :locations)
  (get-one "/locations" "770615e2-745d-42c5-b793-1f4d0b5feba2")

  (every?
   #(=  "775eec55-6190-4905-8422-00631134e54c" (:uuid (:locationHierarchy %)))
   (get-some "/locations" "775eec55-6190-4905-8422-00631134e54c"))


  )
