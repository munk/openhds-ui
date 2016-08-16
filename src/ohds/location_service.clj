(ns ohds.location-service
  (:require [ohds.service :refer [create-entity get-entity get-one]]))

(defn model->request
  "Transform frontend model to rest model"
  [{:keys [name extId type collectionDateTime collectedByUuid]}]
  {:location {:name name
              :extId extId
              :type type
              :collectionDateTime collectionDateTime}
   :collectedByUuid collectedByUuid})

(defn create-location
  "Create a new location and return it's id"
  [request]
  (->> (model->request request)
       (create-entity "/locations")))

(defn all-locations
  "Get all locations"
  []
  (get-entity "/locations.bulk" :locations))

(defn location
  "Get location at uuid"
  [uuid]
  (get-one "/locations" uuid))

(comment
  (create-location
   {:name "test location"
    :extId "test location"
    :type "RURAL"
    :collectionDateTime "2016-08-01T00:56:55.920Z"
    :collectedByUuid "fbf0953f-6f32-4fef-a111-43cf63059100"})

  (all-locations)

  (:locationHierarchy (get-one  "/locations"  "770615e2-745d-42c5-b793-1f4d0b5feba2"))

  )
