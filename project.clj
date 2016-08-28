(defproject ohds "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :dependencies [[org.clojure/clojure "1.9.0-alpha10"]
                 [clj-time "0.11.0"] ; required due to bug in `lein-ring uberwar`
                 [clj-http "2.2.0"]
                 [cheshire "5.6.3"]
                 [crypto-password "0.2.0"]
                 [metosin/compojure-api "1.1.1"]]
  :ring {:handler ohds.handler/app}
  :uberjar-name "server.jar"
  :node-dependencies [[karma "0.12.28"]
                      [karma-chrome-launcher "0.1.7"]]
  :profiles {:dev {:dependencies [[javax.servlet/servlet-api "2.5"]
                                  [clj-http-fake "1.0.2"]
                                  [ring/ring-mock "0.3.0"]
                                  [prismatic/schema-generators "0.1.0"]
                                  #_[clj-webdriver "0.7.2"]
                                  #_[org.seleniumhq.selenium/selenium-server "2.47.0"]
                                  #_[javax.servlet/servlet-api "2.5"]
                                  #_[ring/ring-jetty-adapter "1.4.0"]]
                   :plugins [[lein-ring "0.9.7"]]}})
