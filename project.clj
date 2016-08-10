(defproject ohds "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :dependencies [[org.clojure/clojure "1.8.0"]
                 [clj-time "0.11.0"] ; required due to bug in `lein-ring uberwar`
                 [clj-http "2.2.0"]
                 [cheshire "5.6.3"]
                 [crypto-password "0.2.0"]
                 [metosin/compojure-api "1.1.1"]]
  :ring {:handler ohds.handler/app}
  :uberjar-name "server.jar"
  :profiles {:dev {:dependencies [[javax.servlet/servlet-api "2.5"]]
                   :plugins [[lein-ring "0.9.7"]]}})
